import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { ChooseLevelComponent } from "../choose-level/choose-level.component";

declare var commandHandler: any;

@Injectable()
export class LevelGuard {
    private firstNavigation: boolean = true
    constructor(private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (typeof commandHandler != "undefined") {
            const params = route.component != ChooseLevelComponent ? {
                command: "ChangePage",
                url: state.url
            } : {
                command: "HideBackButton",
                hide: false
            };
            commandHandler.postMessage(JSON.stringify(params));
        }
        if (this.firstNavigation) {
            this.firstNavigation = false;
            if (route.component != ChooseLevelComponent) this.router.navigate(['/choose-level'], { queryParamsHandling: 'merge' })
        }
        return true;
    }
}