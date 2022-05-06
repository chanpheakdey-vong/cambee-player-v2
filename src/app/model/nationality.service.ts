import { Injectable } from "@angular/core";
import { HttpService } from "../config/http.service";
import { DynamicType } from "./dynamic-type";

@Injectable({providedIn: "root"})
export class NationalityService {
    nationalitys: string[] = [];

    constructor(private api: HttpService){
        this.getNationalitys();
    }

    getNationalitys() {
        this.api.get("/student/nationalities").subscribe((data: any) => {
            if (data) {
                const d_data: DynamicType[] = data;
                d_data.map(d => {
                    this.nationalitys.push(d.Nationality);
                })
            }
        });
    }
}