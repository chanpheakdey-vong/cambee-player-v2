import { HttpEventType, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as JSZip from "jszip";
import { HttpService } from "../config/http.service";
import { DynamicType } from "./dynamic-type";

@Injectable({ providedIn: "root" })
export class LearningAudioService {
    audio: DynamicType = {};
    loading: boolean = false;
    loaded: boolean = false;
    retry: boolean = false;
    token: string = "";

    constructor(private api: HttpService, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            if (params["token"]) this.token = params["token"];
        });
    }

    getAudio(level: number, set: number) {
        this.clearAudio();
        this.retry = false;
        this.loaded = false;
        const loader = setTimeout(() => {
            this.loading = true;
        }, 700);
        // this.progress.progress = 0;
        // this.progress.show = true;
        const httpOptions = {
            responseType: 'arraybuffer',
            reportProgress: true,
            observe: 'events',
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this.token}`
            })
        };
        this.api.get(`/levels/${level}/sets/${set}/audios`, httpOptions).subscribe((event: any) => {
            if (event.type == HttpEventType.DownloadProgress) {
                //this.progress.progress = Math.round(100 * (event.loaded / event.total));
            } else if (event.type == HttpEventType.Response) {
                clearTimeout(loader);
                this.loading = false;
                const jsZip = new JSZip();
                jsZip.loadAsync(event.body).then((zip) => {
                    Object.keys(zip.files).forEach((filename) => {
                        if (!zip.files[filename].dir && filename.toLowerCase().indexOf(".mp3") != -1) {
                            zip.files[filename].async('blob').then((fileData) => {
                                this.audio[filename.replace("audio/", "")] = URL.createObjectURL(new Blob([fileData], { type: "audio/mpeg" }));
                            });
                        }
                    });
                    this.loaded = true;
                });
            }
        },
            error => {
                // this.progress.show = false;
                // this.progress.progress = 0;
                clearTimeout(loader);
                this.loading = false;
                this.retry = true;
            });
    }

    loadSrc(ctrl: any, src: string, play: boolean = true) {
        ctrl.src = this.audio[src];
        ctrl.type = "audio/mpeg";
        ctrl.load();
        if (play) ctrl.play();
    }

    revokeAudio(src: string) {
        URL.revokeObjectURL(this.audio[src]);
        this.audio[src] = undefined;
    }

    clearAudio() {
        Object.keys(this.audio).forEach((src) => {
            if (this.audio[src] != undefined) this.revokeAudio(src);
        });
        this.audio = {};
    }
}