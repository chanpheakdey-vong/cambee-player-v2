import { Location } from "@angular/common";
import { HttpHeaders } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "../config/http.service";
import { DynamicType } from "../model/dynamic-type";
import { LearningAudioService } from "../model/learning-audio.service";
import { LevelService } from "../model/level.service";
import { SetService } from "../model/set.service";

@Component({
    selector: 'learning-set',
    templateUrl: './learning-set.component.html'
})
export class LearningSetComponent {
    @ViewChild("msgBox") msgBox: any;
    @ViewChild("audioCtrl") audioCtrl: any;
    cards: DynamicType[] = [];
    curIdx: number = 0;
    level: number = 0;
    set: number = 0;
    setNo: string = "";
    loaded: boolean = false;
    loading: boolean = false;
    retry: boolean = false;
    done_learning: boolean = false;
    submit_loading: boolean = false;
    started: boolean = false;
    learning_duration: DynamicType = {
        minute: 0,
        second: 0
    };
    token: string = "";
    
    constructor(private route: ActivatedRoute, private api: HttpService, private setService: SetService, private levelService: LevelService, public audService: LearningAudioService,
        public location: Location) {
        this.route.queryParams.subscribe(params => {
            this.level = params["level"];
            this.set = params["set"];
            this.setNo = params["setno"];
            if (params["token"]) this.token = params["token"];
        });
        this.audService.getAudio(this.level, this.set);
        this.getCard();
    }

    start() {
        this.started = true;
        this.audService.loadSrc(this.audioCtrl.nativeElement, this.cards[0].audio);
    }

    isLoading() {
        return this.loading || this.audService.loading;
    }

    isLoaded() {
        return this.loaded && this.audService.loaded;
    }

    isRetry() {
        return this.retry || this.audService.retry;
    }

    retryReq () {
        if (this.retry) this.getCard();
        if (this.audService.retry) this.audService.getAudio(this.level, this.set);
    }

    getCard() {
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
        this.api.get(`/levels/${this.level}/sets/${this.set}/cards?type=learning`, httpOptions).subscribe((data: any) => {
            clearTimeout(loader);
            this.loading = false;
            if (data) {
                const d_data: DynamicType[] = data;
                d_data.map(d => {
                    this.cards.push({
                        id: d.id,
                        text: d.text,
                        partOfSpeech: d.partsOfSpeech,
                        example: d.examples,
                        definition: d.definitions,
                        synonym: d.synonyms,
                        audio: d.audio,
                        completed: d.completed
                    });
                })
            }
            this.loaded = true;
            setTimeout(() => {
                this.startLearningTimer();
            }, 1000);
        },
        error => {
            clearTimeout(loader);
            this.loading = false;
            this.retry = true;
        });
    }

    nextCard() {
        this.loaded = false;
        this.curIdx += 1;
        setTimeout(() => {
            this.loaded = true;    
        }, 100);
        this.audService.loadSrc(this.audioCtrl.nativeElement, this.cards[this.curIdx].audio);
    }

    prevCard() {
        this.loaded = false;
        this.curIdx -= 1;
        setTimeout(() => {
            this.loaded = true;    
        }, 100);
        this.audService.loadSrc(this.audioCtrl.nativeElement, this.cards[this.curIdx].audio);
    }

    startLearningTimer() {
        if (this.done_learning) return;
        if (this.learning_duration.second > 59) {
            this.learning_duration.minute += 1;
            this.learning_duration.second = 0;
        } else {
            this.learning_duration.second += 1;
        }
        setTimeout(() => {
            this.startLearningTimer();
        }, 1000);
    }

    finish() {
        const loader = setTimeout(() => {
            this.submit_loading = true;
        }, 700);
        const body: DynamicType = {
            duration: this.learning_duration.minute * 60 + this.learning_duration.second
        }
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'text/html',
                'Content-Type': 'application/json'
            }),
            responseType: 'text'
        };
        this.api.post(`/levels/${this.level}/sets/${this.set}/learn`, body, httpOptions).subscribe((data: any) => {
            clearTimeout(loader);
            this.submit_loading = false;
            this.done_learning = true;
            this.setService.completedLearning(this.level, this.set);
            this.levelService.checkCompleted(this.level);
        },
        error => {
            clearTimeout(loader);
            this.submit_loading = false;
            this.msgBox.msg.msg = "Failed request. Please try again later.";
            this.msgBox.setShow(true);
        });
    }
}