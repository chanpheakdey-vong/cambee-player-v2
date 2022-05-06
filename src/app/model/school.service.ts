import { Injectable } from "@angular/core";
import { HttpService } from "../config/http.service";
import { DynamicType } from "./dynamic-type";

@Injectable({providedIn: "root"})
export class SchoolService {
    schools: string[] = [];

    constructor(private api: HttpService){
        this.getSchools();
    }

    getSchools() {
        this.api.get("/student/schools").subscribe((data: any) => {
            if (data) {
                const d_data: DynamicType[] = data;
                d_data.map(d => {
                    this.schools.push(d.SchoolName);
                })
            }
        });
    }
}