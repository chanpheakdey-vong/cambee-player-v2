import { HttpHeaders } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "../config/http.service";
import { DynamicType } from "../model/dynamic-type";
import { LearningAudioService } from "../model/learning-audio.service";
import { LevelService } from "../model/level.service";
import { SetService } from "../model/set.service";

@Component({
    selector: 'practice-set',
    templateUrl: './practice-set.component.html'
})
export class PracticeSetComponent {
    @ViewChild("audioCtrl") audioCtrl: any;
    @ViewChild("msgBox") msgBox: any;
    @ViewChild("txt") txt: any;
    incorrect_num: number = 0;
    alertMsg: DynamicType = {
        msg: "",
        correct: null,
        show: false,
        timeout: null
    }
    token: string = "";
    level: number = 0;
    set: number = 0;
    setNo: string = "";
    backnum: number = 1;
    card_active: string = "meaning";
    data: DynamicType = {
        spelling: ""
    };
    practice_duration: DynamicType = {
        minute: 0,
        second: 0
    }
    card_meaning: DynamicType[] = [];
    curIdx_meaning: number = 0;
    retry_card: boolean = false;
    loaded_card: boolean = false;
    loading_card: boolean = false;
    card_spelling: DynamicType[] = [];
    curIdx_spelling: number = 0;
    loaded_learning: boolean = false;
    done_meaning: boolean = false;
    done_practice: boolean = false;
    card_learning: DynamicType = {};
    submit_loading: boolean = false;
    loaded_next: boolean = true;

    constructor(private api: HttpService, private route: ActivatedRoute, private levelService: LevelService, private setService: SetService,
        private audService: LearningAudioService) {
        this.route.queryParams.subscribe(params => {
            this.level = params["level"];
            this.set = params["set"];
            this.setNo = params["setno"];
            if (params["backnum"]) this.backnum = parseInt(params["backnum"]);
            if (params["token"]) this.token = params["token"];
        });
        this.audService.getAudio(this.level, this.set);
        this.getCard();
    }

    ngAfterViewInit() {
        //Prevent Cheating
        let oldInput : any = null;
        this.txt.nativeElement.addEventListener('input',(e : any) => {
            this.txt.nativeElement.type = "text";
            let value = e.target.value;
            if(value != ''){
                var compareLength = value.length - (oldInput == null ? 1 : oldInput.length);
                if(compareLength > 1){
                    if(oldInput == '' )oldInput = null;
                    console.log('input:' + oldInput)
                    oldInput = value;
                    // alert('too many character')
                }else{
                    oldInput = value
                    console.log('Valid:'+oldInput)
                    console.log('Valid length:'+oldInput.length)
                    console.log('Valid index 0:'+oldInput[0])
                    if(oldInput.length == 2 && (oldInput[0] == ' ' || oldInput[0] == null)){
                        
                        value = oldInput[1];
                        console.log('Valid index 1:'+oldInput[1])
                        oldInput = oldInput[1]
                    }
                }
            }else{
                oldInput = null;
                value = ""
            }
            console.log(value, value.length)
        })
        this.txt.nativeElement.addEventListener('focus',(e : any) => {
            let value = e.target.value;
            oldInput = value == '' ? null : value ;
        })
        this.txt.nativeElement.addEventListener('blur',(e : any) => {
            this.txt.nativeElement.type = "password";
        })
    }

    isLoaded() {
        return this.loaded_card && this.audService.loaded;
    }

    isLoading() {
        return this.loading_card || this.audService.loading;
    }

    isRetry() {
        return this.retry_card || this.audService.retry;
    }

    retryReq() {
        if (this.retry_card) this.getCard();
        if (this.audService.retry) this.audService.getAudio(this.level, this.set);
    }

    getCard() {
        this.retry_card = false;
        this.loaded_card = false;
        const loader = setTimeout(() => {
            this.loading_card = true;
        }, 700);
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this.token}`
            })
        };
        this.api.get(`/levels/${this.level}/sets/${this.set}/cards?type=practice`, httpOptions).subscribe((data: any) => {
            clearTimeout(loader);
            this.loading_card = false;
            if (data) {
                this.card_meaning = [];
                this.card_spelling = [];
                const d_data_meaning: DynamicType[] = data.meaningCards;
                d_data_meaning.map(d => {
                    d.answer = d.text[0];
                    this.shuffle(d.text)
                    let choice: DynamicType[] = [];
                    d.text.map((t: any, idx: number) => {
                        choice.push({
                            text: String.fromCharCode(idx + 65),
                            value: t,
                            correct: null
                        })
                    })
                    this.card_meaning.push({
                        id: d.id,
                        choice: choice,
                        answer: d.answer,
                        partOfSpeech: d.partsOfSpeech,
                        example: d.examples,
                        definition: d.definitions,
                        synonym: d.synonyms,
                        audio: d.audio,
                        completed: d.completed
                    });
                })

                const d_data_spelling: DynamicType[] = data.spellingCards;
                d_data_spelling.map(d => {
                    this.card_spelling.push({
                        id: d.id,
                        answer: d.text,
                        correct: null,
                        partOfSpeech: d.partsOfSpeech,
                        example: d.examples,
                        definition: d.definitions,
                        synonym: d.synonyms,
                        audio: d.audio,
                        completed: d.completed
                    });
                })
            }
            this.loaded_card = true;
            setTimeout(() => {
                this.startPracticeTimer();
            }, 1000);
        },
        error => {
            clearTimeout(loader);
            this.loading_card = false;
            this.retry_card = true;
        });
    }

    shuffle(arr: any) {
		if (arr.length > 0 && arr[0].length > 2 && arr[0].substring(1,2) === ".") return
		let j,tmp
		for(let i=arr.length-1; i>0; i--){
			j = Math.floor(Math.random() * (i+1))
			tmp = arr[i]
			arr[i] = arr[j]
			arr[j] = tmp
		}
	}

    checkAnswer(card: DynamicType, choice: DynamicType) {
        if (this.alertMsg.show) {
            clearTimeout(this.alertMsg.timeout);
        }
        if (card.answer == choice.value) {
            choice.correct = true;
            this.alertMsg.msg = this.incorrect_num == 0 ? "Good Work" : "Super";
            this.alertMsg.correct = true;
        } else {
            let temp: DynamicType = {...this.card_meaning[this.curIdx_meaning]};
            this.card_meaning.splice(this.curIdx_meaning, 1)
            this.card_meaning.push(temp);
            this.card_learning = temp;
            this.card_active = "learning";
            this.loaded_learning = false;
            setTimeout(() => {
                this.loaded_learning = true;
            }, 10);
            this.audService.loadSrc(this.audioCtrl.nativeElement, this.card_meaning[this.card_meaning.length - 1].audio);
            //choice.correct = false;
            //this.incorrect_num += 1;
            this.alertMsg.msg = this.incorrect_num == 1 ? "Almost" : "Keep on trying";
            this.alertMsg.correct = false;
        }
        this.alertMsg.show = true;
        this.alertMsg.timeout = setTimeout(() => {
            this.alertMsg.show = false;
            if (choice.correct) {
                this.incorrect_num = 0;
                this.nextCardMeaning();
            }
        }, 2000);
    }

    nextCardMeaning() {
        if (this.curIdx_meaning < this.card_meaning.length - 1) {
            this.curIdx_meaning += 1;
            this.loaded_next = false;
            setTimeout(() => {
                this.loaded_next = true;
            }, 10);
        } else {
            this.card_active = "spelling";
            this.done_meaning = true;
            this.audService.loadSrc(this.audioCtrl.nativeElement, this.card_spelling[this.curIdx_spelling].audio);
            setTimeout(() => {
                this.txt.nativeElement.focus();    
            }, 100);
        }
    }

    nextCardSpelling() {
        if (this.curIdx_spelling < this.card_spelling.length - 1) {
            this.curIdx_spelling += 1;
            this.audService.loadSrc(this.audioCtrl.nativeElement, this.card_spelling[this.curIdx_spelling].audio);
        } else {
            this.donePractice();
        }
    }

    checkAnswerSpelling(card: DynamicType, ans: string) {
        if (this.alertMsg.show) {
            clearTimeout(this.alertMsg.timeout);
        }
        let answer: string[] = card.answer.toLowerCase().split(",");
        if (answer.indexOf(ans.toLowerCase()) != - 1) {
            card.correct = true;
            this.alertMsg.msg = this.incorrect_num == 0 ? "Good Work" : "Super";
            this.alertMsg.correct = true;
        } else {
            let temp: DynamicType = {...this.card_spelling[this.curIdx_spelling]};
            this.card_spelling.splice(this.curIdx_spelling, 1)
            this.card_spelling.push(temp);
            this.card_learning = temp;
            this.card_active = "learning";
            this.loaded_learning = false;
            setTimeout(() => {
                this.loaded_learning = true;
            }, 10);
            this.audService.loadSrc(this.audioCtrl.nativeElement, this.card_spelling[this.card_spelling.length - 1].audio);
            //card.correct = false;
            //this.incorrect_num += 1;
            this.alertMsg.msg = this.incorrect_num == 1 ? "Almost" : "Keep on trying";
            this.alertMsg.correct = false;
        }
        this.alertMsg.show = true;
        this.alertMsg.timeout = setTimeout(() => {
            this.alertMsg.show = false;
            if (card.correct) {
                this.data.spelling = "";
                this.txt.nativeElement.focus();
                this.incorrect_num = 0;
                this.audService.revokeAudio(this.card_spelling[this.curIdx_spelling].audio);
                this.nextCardSpelling();
            }
        }, 2000);
    }
    
    backPractice() {
        this.card_active = this.done_meaning ? "spelling" : "meaning";
        if (this.done_meaning) {
            this.audService.loadSrc(this.audioCtrl.nativeElement, this.card_spelling[this.curIdx_spelling].audio);
            this.data.spelling = "";
            setTimeout(() => {
                this.txt.nativeElement.focus();    
            }, 100);
        }
    }

    startPracticeTimer() {
        if (this.done_practice) return;
        if (this.practice_duration.second > 59) {
            this.practice_duration.minute += 1;
            this.practice_duration.second = 0;
        } else {
            this.practice_duration.second += 1;
        }
        setTimeout(() => {
            this.startPracticeTimer();
        }, 1000);
    }

    donePractice() {
        const loader = setTimeout(() => {
            this.submit_loading = true;
        }, 700);
        const body: DynamicType = {
            duration: this.practice_duration.minute * 60 + this.practice_duration.second
        }
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'text/html',
                'Content-Type': 'application/json'
            }),
            responseType: 'text'
        };
        this.api.post(`/levels/${this.level}/sets/${this.set}/practice`, body, httpOptions).subscribe((data: any) => {
            clearTimeout(loader);
            this.submit_loading = false;
            this.done_practice = true;
            this.setService.completedPractice(this.level, this.set);
            this.levelService.checkCompleted(this.level);
        },
        error => {
            clearTimeout(loader);
            this.submit_loading = false;
            this.msgBox.msg.msg = "Failed request. Please try again later.";
            this.msgBox.setShow(true);
        });
    }

    back() {
        history.go(this.backnum * -1);
    }
}