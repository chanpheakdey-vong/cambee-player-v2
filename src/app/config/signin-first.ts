import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { SigninComponent } from "../signin/signin.component";
import { AuthService } from "./auth.service";

@Injectable()
export class SigninFirstGuard {
    private firstNavigation: boolean = true
    constructor(private router: Router, private auth: AuthService) { }
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.auth.isLogin()) {
            if (this.firstNavigation) {
                if (route.component != HomeComponent) this.router.navigateByUrl("/home");
            } else {
                if (route.component == SigninComponent) this.router.navigateByUrl("/home");
            }
        } else {
            if (route.component != SigninComponent) this.router.navigateByUrl("/");
        }
        this.firstNavigation = false;
        return true;
    }
}