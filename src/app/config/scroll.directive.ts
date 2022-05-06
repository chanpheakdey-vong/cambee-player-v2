import { AfterViewInit, Directive, ElementRef, HostListener, Input } from "@angular/core";
import { ScrollService } from "./scroll.service";

@Directive({
    selector: "[scrollDir]"
})
export class ScrollDirective implements AfterViewInit {
    @Input('scrollDir') name: string = "";

    constructor(private el: ElementRef, private scroll: ScrollService) { }

    @HostListener("scroll", ["$event"])
    onScroll($event: Event): void {
        this.scroll.setScroll(this.name, this.el.nativeElement.scrollTop);
    }

    ngAfterViewInit(){
        this.el.nativeElement.scrollTop = this.scroll.getScroll(this.name);
    }
}