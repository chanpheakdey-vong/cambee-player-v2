import { HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "../config/http.service";
import { DynamicType } from "../model/dynamic-type";

@Component({
    selector: 'leaderboard',
    templateUrl: './leaderboard.component.html'
})
export class LeaderboardComponent {
    leaderboard: DynamicType[] = [];
    loaded: boolean = false;
    loading: boolean = false;
    retry: boolean = false;
    level: number = 0;
    token: string = "";
    backNum: number = 1;

    constructor(private api: HttpService, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.level = params["level"];
            this.token = params["token"];
            if (params["backnum"]) this.backNum = parseInt(params["backnum"]);
        });
        this.getLeaderboard();
    }

    getLeaderboard() {
        this.retry = false;
        this.loaded = false;
        const loader = setTimeout(() => {
            this.loading = true;
        }, 700);
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this.token}`
            })
        };
        this.api.get(`/levels/${this.level}/leaderboard`, httpOptions).subscribe((data: any) => {
            clearTimeout(loader);
            this.loading = false;
            this.leaderboard = [];
            data.map((d: any) => {
                this.leaderboard.push({
                    id: d.contactId,
                    name: d.name,
                    photo: d.photo ? d.photo : "assets/img/photo-default.jpg",
                    sets: d.sets,
                    time: d.time
                });
            })
            this.loaded = true;
        },
            error => {
                clearTimeout(loader);
                this.loading = false;
                this.retry = true;
            });
    }

    back() {
        history.go(this.backNum * -1);
    }
}