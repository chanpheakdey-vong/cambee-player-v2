import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from "@angular/core";
import * as JSZip from "jszip";
import { HttpService } from "../config/http.service";
// import Keyboard from 'simple-keyboard';
import { DynamicType } from "../model/dynamic-type";
import { HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'competition',
    templateUrl: './competition.component.html'
})
export class CompetitionComponent implements AfterViewInit {
    @ViewChild("audioCtrl") audioCtrl: any;
    @ViewChild("txt") txt: any;
    @ViewChild("progress") progress: any;
    @ViewChild("msgBox") msgBox: any;
    fileData: any;
    meta: any;
    audio: any = {};
    count_audio: number = 0;
    curIdx: number = 0;
    loaded_meta: boolean = false;
    loading: boolean = false;
    submit_loading: boolean = false;
    loaded: boolean = false;
    retry: boolean = false;
    retryGetTime: boolean = false;
    // keyboard: any;
    data: DynamicType = {
        value: "",
        checkStart: false,
        checkRemainTime: true
    }
    countDown: DynamicType = {
        minute: 20,
        second: 0
    }
    duration: number = 0;
    remainingStart: DynamicType = {
        minute: 0,
        second: 0
    }
    params: DynamicType = {
        registrationId: null,
        practiceId: null,
        roundId: null,
        competitionRoundDetailId: null,
        token: null
    }
    isMock: boolean = false;
    hasSubmit: boolean = false;

    constructor(private api: HttpService, private route: ActivatedRoute,private renderer: Renderer2) {
        this.route.queryParams.subscribe(params => {
            this.params.registrationId = parseInt(params["registrationId"]);
            this.params.practiceId = parseInt(params["practiceId"]);
            this.isMock = this.params.practiceId == 6
            this.params.roundId = parseInt(params["roundId"]);
            this.params.competitionRoundDetailId = parseInt(params["competitionRoundDetailId"]);
            this.params.token = params["token"];
            let rem = parseInt(params["remainingTimeInSeconds"]);
            if (rem > 0) {
                this.remainingStart.minute = Math.floor(rem / 60);
                this.remainingStart.second = rem - this.remainingStart.minute * 60;
            }
            this.duration = parseInt(params["timeAllowed"])
            this.countDown.minute = this.duration;
        });

        setTimeout(() => {
            this.startCountDownRemaining();
        }, 1000);
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

        //---------------------------------------------------------------------------------

        // this.keyboard = new Keyboard({
        //     onChange: input => this.onChange(input),
        //     onKeyPress: (button: any) => this.onKeyPress(button),
        //     mergeDisplay: true,
        //     layoutName: "default",
        //     layout: {
        //         default: [
        //             "q w e r t y u i o p",
        //             "a s d f g h j k l",
        //             "{shift} z x c v b n m {backspace}",
        //             "{numbers} {space} {ent}"
        //         ],
        //         shift: [
        //             "Q W E R T Y U I O P",
        //             "A S D F G H J K L",
        //             "{shift} Z X C V B N M {backspace}",
        //             "{numbers} {space} {ent}"
        //         ],
        //         numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"]
        //     },
        //     display: {
        //         "{numbers}": "123",
        //         "{ent}": "return",
        //         "{escape}": "esc ⎋",
        //         "{tab}": "tab ⇥",
        //         "{backspace}": "⌫",
        //         "{capslock}": "caps lock ⇪",
        //         "{shift}": "⇧",
        //         "{controlleft}": "ctrl ⌃",
        //         "{controlright}": "ctrl ⌃",
        //         "{altleft}": "alt ⌥",
        //         "{altright}": "alt ⌥",
        //         "{metaleft}": "cmd ⌘",
        //         "{metaright}": "cmd ⌘",
        //         "{abc}": "ABC"
        //     }
    }

    ngAfterContentInit() {
        setTimeout(() => {
            this.getAudio();
        }, 100);
    }

    // onChange = (input: string) => {
    //     this.data.value = input;
    // };

    // onKeyPress = (button: string) => {
    //     if (button === "{shift}" || button === "{lock}") this.handleShift();
    //     else if (button === "{numbers}" || button === "{abc}") this.handleNumbers();
    // };

    // onInputChange = (event: any) => {
    //     this.keyboard.setInput(event.target.value);
    // };

    // handleShift = () => {
    //     let currentLayout = this.keyboard.options.layoutName;
    //     let shiftToggle = currentLayout === "default" ? "shift" : "default";

    //     this.keyboard.setOptions({
    //         layoutName: shiftToggle
    //     });
    // };

    // handleNumbers = () => {
    //     let currentLayout = this.keyboard.options.layoutName;
    //     let numbersToggle = currentLayout !== "numbers" ? "numbers" : "default";
    //     this.keyboard.setOptions({
    //         layoutName: numbersToggle
    //     });
    // };

    getAudio() {
        this.retry = false;
        this.loaded = false;
        const loader = setTimeout(() => {
            this.loading = true;
        }, 700);
        this.progress.progress = 0;
        this.progress.show = true;
        this.api.get(`https://cambee-api.azurewebsites.net/download-practice-package?registrationId=${this.params.registrationId}`, {
            responseType: 'arraybuffer',
            reportProgress: true,
            observe: 'events'
        }).subscribe((event: any) => {
            if (event.type == HttpEventType.DownloadProgress) {
                this.progress.progress = Math.round(100 * (event.loaded / event.total));
            } else if (event.type == HttpEventType.Response) {
                const jsZip = new JSZip();
                jsZip.loadAsync(event.body).then((zip) => {
                    if (zip.files["meta.json"]) {
                        zip.files["meta.json"].async('string').then((fileData) => {
                            this.meta = JSON.parse(fileData)
                            this.loaded_meta = true;
                        });
                    }

                    Object.keys(zip.files).forEach((filename) => {
                        if (!zip.files[filename].dir && filename.indexOf("audio") != -1) {
                            zip.files[filename].async('blob').then((fileData) => {
                                this.audio[filename.replace("audio/", "")] = {
                                    data: URL.createObjectURL(new Blob([fileData], { type: "audio/mpeg" }))
                                }
                                this.count_audio += 1;
                                if (this.loaded_meta && this.count_audio == this.meta.length) {
                                    this.progress.show = false;
                                    this.progress.progress = 0;
                                    this.data.checkStart = true;
                                    this.loaded = true;
                                }
                            });
                        }
                    });
                });
            }


            clearTimeout(loader);
            this.loading = false;
        },
            error => {
                this.progress.show = false;
                this.progress.progress = 0;
                clearTimeout(loader);
                this.loading = false;
                this.retry = true;
            });
    }

    nextAudio() {
        if (this.curIdx < this.meta.length - 1) {
            this.curIdx += 1;
            this.data.value = "";
            // this.keyboard.setInput("");
            this.audioCtrl.nativeElement.src = this.audio[this.meta[this.curIdx].audioSrc].data
            this.audioCtrl.nativeElement.type = "audio/mpeg";
            this.audioCtrl.nativeElement.load();
            this.audioCtrl.nativeElement.play();
            this.txt.nativeElement.focus();
        } else {
            this.submit();
        }
    }

    ok(text: string) {
        this.meta[this.curIdx].answer = text;
        this.nextAudio();
    }

    // skip() {
    //     this.meta[this.curIdx].answer = "";
    //     this.nextAudio();
    // }

    play() {
        this.audioCtrl.nativeElement.play();
        this.txt.nativeElement.focus();
    }

    start() {
        this.data.checkStart = false;
        this.audioCtrl.nativeElement.src = this.audio[this.meta[this.curIdx].audioSrc].data
        this.audioCtrl.nativeElement.type = "audio/mpeg";
        this.audioCtrl.nativeElement.load();
        this.audioCtrl.nativeElement.play();
        this.txt.nativeElement.focus();
        if(document.activeElement instanceof HTMLElement){
            document.activeElement.blur();
        }
        this.txt.nativeElement.focus();
        setTimeout(() => {
            this.startCountDown();
        }, 1000);
    }

    startCountDown() {
        if (this.countDown.second > 0) {
            this.countDown.second -= 1;
        } else {
            this.countDown.minute -= 1;
            this.countDown.second = 59;
        }
        if (this.countDown.minute > 0 || this.countDown.second > 0) {
            setTimeout(() => {
                this.startCountDown();
            }, 1000);
        } else {
            this.msgBox.msg.msg = "Time up";
            this.msgBox.setShow(true);
            this.submit();
        }
    }

    startCountDownRemaining() {
        if (this.remainingStart.second > 0) {
            this.remainingStart.second -= 1;
        } else {
            if (this.remainingStart.minute > 0) {
                this.remainingStart.minute -= 1;
                this.remainingStart.second = 59;
            }
        }
        if (this.remainingStart.minute > 0 || this.remainingStart.second > 0) {
            setTimeout(() => {
                this.startCountDownRemaining();
            }, 1000);
        } else {
            this.data.checkRemainTime = false;
        }
    }

    doubleDigit(num: number) {
        let str: string = `${num}`;
        if (str.length == 1) str = `0${str}`;
        return str;
    }

    submit() {
        if (this.submit_loading || this.hasSubmit) return;
        let test_duration: number = 0, isTimeup = false;
        if (this.countDown.minute > 0 || this.countDown.second > 0) {
            test_duration = this.duration * 60 - (this.countDown.minute * 60 + this.countDown.second);
        } else {
            isTimeup = true;
            test_duration = this.duration * 60;
        }
        let ans: DynamicType[] = [];
        this.meta.map((m: any) => {
            ans.push({
                "audioId": m.id,
                "answer": m.answer == undefined ? "" : m.answer
            })
        })
        const body = new HttpParams()
            .set('practiceId', this.params.practiceId)
            .set('registrationId', this.params.registrationId)
            .set('roundId', this.params.roundId)
            .set('competitionRoundDetailId', this.params.competitionRoundDetailId)
            .set('duration', test_duration.toString())
            .set('userAnswers', JSON.stringify(ans));
        const httpOptions = {
            headers: new HttpHeaders({
                'x-access-token': this.params.token
            })
        };
        const loader = setTimeout(() => {
            this.submit_loading = true;
        }, 700);
        this.api.post("https://cambee-api.azurewebsites.net/log", body, httpOptions).subscribe((data: any) => {
            clearTimeout(loader);
            this.submit_loading = false;
            this.hasSubmit = true;
        },
        error => {
            clearTimeout(loader);
            this.submit_loading = false;
            this.msgBox.msg.msg = "Failed request. Please try again later.";
            this.msgBox.setShow(true);
        });
    }
}