import {Component, Inject, provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ControlGroup, FormBuilder, Validators} from "angular2/common";
import {HTTP_PROVIDERS} from "angular2/http";
import {Title} from "angular2/platform/browser";
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES, ROUTER_PROVIDERS,
    LocationStrategy, HashLocationStrategy} from "angular2/router";

import {Row} from './scripts/row.ts';
import {AlternateCasePipe} from './scripts/pipe.ts';
import {GameService} from './scripts/gameService.ts'
import {HomeComponent} from "../32-auxiliary-routes/components";

@Inject ()  // can inject service into another service... can't see a good use case for it being inline though.
            // Better as separate file that comprises of many sub-services
class FakeService {
    fakeVar: any = 'blah';
    game: GameService;
    constructor(private gs: GameService) {
        this.game = gs;
        console.log("in fake service");
    }
}

const jsonRequestHeaders = {
    headers: new Headers({
        "Accept": "application/json"
    })
};

@Component({
    selector: 'misc',
    templateUrl: 'templates/miscPage.html',
    pipes: [AlternateCasePipe]
})
class miscComponent {
    message: string;
    textColor: string;
    loginFormControlGroup: ControlGroup;

    constructor(params: RouteParams) {
        this.message = params.get("message");

        this.loginFormControlGroup = new FormBuilder().group({
            'username': ['user', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
            'password': ['password', Validators.minLength(3)]
        });
    }

    updateColor() {
        this.textColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    }
};

@Component({
    selector: 'home',
    templateUrl: 'templates/game.html',
    directives: [Row],
    providers: [GameService]
})
class homeComponent {
    gameService: any;

    constructor(gameService: GameService) {
        this.gameService = gameService;
    }
};


@Component ({
    selector: 'ju-app',
    templateUrl: 'templates/app.html',
    directives: [Row, ROUTER_DIRECTIVES],
    providers: [GameService, FakeService]
})
@RouteConfig([
    {path: '/home', component: homeComponent, name: 'Home', useAsDefault: true},
    {path: '/misc/:message', component: miscComponent, name: 'Misc'},
    {path: '/:anything', redirectTo: ["Home"]}
])
class myComponent {
    //gameService: any;

    constructor(/*gameService: GameService, fakeService: FakeService,*/ router: Router, title: Title) {

        //this.gameService = gameService;
        //console.log(fakeService.fakeVar);

        router.subscribe((url) => {
            title.setTitle(url);
        })
    }

    onLogin() {
        console.log('login');
    }
}


bootstrap(myComponent, [HTTP_PROVIDERS, ROUTER_PROVIDERS,
    Title, provide(LocationStrategy, { useClass: HashLocationStrategy })]);