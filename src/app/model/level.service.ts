import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "../config/http.service";
import { DynamicType } from "./dynamic-type";
import { SetService } from "./set.service";

@Injectable({providedIn: "root"})
export class LevelService {
    token: string = "";
    levels: DynamicType[] = [];
    loading: boolean = false;
    loaded: boolean = false;
    retry: boolean = false;

    constructor(private api: HttpService, private route: ActivatedRoute, private set: SetService){
        this.route.queryParams.subscribe(params => {
            if(params["token"]) this.token = params["token"];
        });
        this.getLevel();
    }

    getLevel() {
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
        this.api.get("/levels", httpOptions).subscribe((data: any) => {
            this.levels = [];
            clearTimeout(loader);
            this.loading = false;
            if (data) {
                const d_data: DynamicType[] = data;
                d_data.map(d => {
                    this.levels.push({
                        id: d.id,
                        no: d.tierIndex,
                        name: d.name,
                        completed: d.completed
                    });
                    this.set.getSet(d.id);
                })
            }
            this.loaded = true;
        },
        error => {
            clearTimeout(loader);
            this.loading = false;
            this.retry = true;
        });
    }

    isEnable(idx: number) {
        if (idx == 0) return true;
        else if (idx > 0 && this.levels[idx - 1].completed)  return true;
        else return false;
    }

    checkCompleted(id: number) {
        if (this.set.isCompletedAll(id)) {
            let l = this.levels.filter(l => l.id == id);
            if (l.length > 0) l[0].completed = true;
        }
    }
}