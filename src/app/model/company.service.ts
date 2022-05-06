import { Injectable } from "@angular/core";
import { HttpService } from "../config/http.service";
import { DynamicType } from "./dynamic-type";

@Injectable({providedIn: "root"})
export class CompanyService {
    companys: string[] = [];

    constructor(private api: HttpService){
        this.getCompanys();
    }

    getCompanys() {
        this.api.get("/student/companies").subscribe((data: any) => {
            if (data) {
                const d_data: DynamicType[] = data;
                d_data.map(d => {
                    this.companys.push(d.WorkPlace);
                })
            }
        });
    }
}