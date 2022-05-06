import { Injectable } from "@angular/core";
import { HttpService } from "../config/http.service";
import { DynamicType } from "./dynamic-type";

@Injectable({providedIn: "root"})
export class GradeService {
    grades: DynamicType[] = [];

    constructor(private api: HttpService){
        this.getGrades();
    }

    getGrades() {
        this.api.get("/grade").subscribe((data: any) => {
            if (data) {
                const d_data: DynamicType[] = data;
                d_data.map(d => {
                    this.grades.push({
                        grade: d.grade,
                        gradeName: d.GradeName
                    });
                })
            }
        });
    }
}