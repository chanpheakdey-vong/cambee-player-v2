import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "../config/http.service";
import { DynamicType } from "./dynamic-type";

@Injectable({ providedIn: "root" })
export class SetService {
    token: string = "";
    sets: DynamicType = {};
    loading: boolean = false;
    loaded: boolean = false;
    retry: boolean = false;

    constructor(private api: HttpService, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            if(params["token"]) this.token = params["token"];
        });
    }

    getSet(level: number) {
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
        this.api.get(`/levels/${level}/sets`, httpOptions).subscribe((data: any) => {
            clearTimeout(loader);
            this.loading = false;
            if (data) {
                const d_data: DynamicType[] = data;
                let flip: number = 1, i = 0;
                let rows: DynamicType = {
                    "1": 3,
                    "-1": 4
                }
                this.sets[level] = [];
                while (i < d_data.length) {
                    let row = [];
                    for (let j = 0; j < rows[flip]; j++) {
                        if (i < d_data.length) {
                            row.push({
                                id: d_data[i].id,
                                no: d_data[i].tierIndex,
                                learningCompleted: d_data[i].learningCompleted,
                                practiceCompleted: d_data[i].practiceCompleted
                            })
                        } else {
                            row.push({
                                hidden: true
                            })
                        }
                        i += 1;
                    }
                    flip *= -1;
                    this.sets[level].push({
                        row: row
                    });
                }
                this.loaded = true;
            }
        },
            error => {
                clearTimeout(loader);
                this.loading = false;
                this.retry = true;
            });
    }

    isEnable(level: number, set: number, type: string) {
        if (!this.sets[level]) return false;
        let i: number = 0, j: number = 0;
        let found: boolean = false;
        if (type == "learning") type = "learningCompleted";
        else type = "practiceCompleted";
        for (let ii=0; i<this.sets[level].length; ii++) {
            i = ii;
            for (let jj=0; jj<this.sets[level][ii].row.length; jj++) {
                if (this.sets[level][ii].row[jj].id == set) {
                    j = jj;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }

        if (i == 0 && j == 0) return true;
        else if (j > 0 && this.sets[level][i].row[j - 1][type]) return true;
        else if (j == 0 && this.sets[level][i-1] && this.sets[level][i-1].row[this.sets[level][i-1].row.length - 1][type]) return true;
        else return false;
    }

    isCompleted(s: DynamicType, type: string) {
        if (type == "learning") type = "learningCompleted" ;
        else type = "practiceCompleted";
        return s[type] && !s.hidden;
    }

    isCompletedAll(level: number) {
        if (!this.sets[level]) return false;
        let rs: boolean = true;
        for (let i=0; i<this.sets[level].length; i++) {
            for (let j=0; j<this.sets[level][i].row.length; j++) {
                if ((!this.sets[level][i].row[j].learningCompleted || !this.sets[level][i].row[j].practiceCompleted) && !this.sets[level][i].row[j].hidden) {
                    rs = false;
                    break;
                } 
            }
            if (!rs) break;
        }
        return rs;
    }

    completedPractice(level: number, set: number) {
        if (!this.sets[level]) return;
        let found: boolean = false;
        for (let i=0; i<this.sets[level].length; i++) {
            for (let j=0; j<this.sets[level][i].row.length; j++) {
                if (this.sets[level][i].row[j].id == set) {
                    this.sets[level][i].row[j].practiceCompleted = true
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }

    completedLearning(level: number, set: number) {
        if (!this.sets[level]) return;
        let found: boolean = false;
        for (let i=0; i<this.sets[level].length; i++) {
            for (let j=0; j<this.sets[level][i].row.length; j++) {
                if (this.sets[level][i].row[j].id == set) {
                    this.sets[level][i].row[j].learningCompleted = true
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }

    getNumberOfCompletedLearning(level: number) {
        if (!this.sets[level]) return;
        let num: number = 0;
        this.sets[level].map((s: any) => {
            s.row.map((r: any) => {
                if (r.learningCompleted) num += 1;
            })
        })
        return num;
    }

    getNumberOfCompletedPractice(level: number) {
        if (!this.sets[level]) return;
        let num: number = 0;
        this.sets[level].map((s: any) => {
            s.row.map((r: any) => {
                if (r.practiceCompleted) num += 1;
            })
        })
        return num;
    }

    getTotalOfSet(level: number) {
        if (!this.sets[level]) return;
        let num: number = 0;
        this.sets[level].map((s: any) => {
            s.row.map((r: any) => {
                if (!r.hidden) num += 1;
            })
        })
        return num;
    }

    getPercentOfLearning(level: number) {
        let n = this.getNumberOfCompletedLearning(level);
        let t = this.getTotalOfSet(level);
        if (!n || !t) return 0;
        else return n * 100 / t;
    }

    getPercentOfPractice(level: number) {
        let n = this.getNumberOfCompletedPractice(level);
        let t = this.getTotalOfSet(level);
        if (!n || !t) return 0;
        else return n * 100 / t;
    }
}