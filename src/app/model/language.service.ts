import { Injectable } from "@angular/core";
import { HttpService } from "../config/http.service";
import { DynamicType } from "./dynamic-type";

@Injectable({providedIn: "root"})
export class LanguageService {
    languages: string[] = [];

    constructor(private api: HttpService){
        this.getLanguages();
    }

    getLanguages() {
        this.api.get("/student/languages").subscribe((data: any) => {
            if (data) {
                const d_data: DynamicType[] = data;
                d_data.map(d => {
                    this.languages.push(d.Language);
                })
            }
        });
    }
}