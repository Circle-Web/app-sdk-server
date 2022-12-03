import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly options = {
            match: /^\/api/,
            getMatch: /^\/api(.*)(\/isauth)(\/){0,1}(.*)/,
            ignoreApi: ['/user/login', '/user/register', '/appstore/tagList', '/appstore/extList', '/appstore/search', '/appstore/extMainDetail'],
        },
    ) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const requestUrl = request.url;
        if (this.options.ignoreApi.filter(api => requestUrl.includes(api)).length) {
            return true;
        }

        // if (requestMethod === 'GET') {
        //     if (this.options.getMatch.test(requestUrl)) {
        //         return super.canActivate(context);
        //     } else {
        //         return true;
        //     }
        // }

        // if (this.options.match.test(requestUrl)) {
        //     return super.canActivate(context);
        // } else {
        //     return true;
        // }
        return super.canActivate(context);
    }

    handleRequest(err, user) {
        console.log('handleRequest', err, user);
        if (err || !user) {
            // jwt 只解决登录态问题 409
            throw new HttpException('登录态已失效', HttpStatus.CONFLICT);
        }
        return user;
    }
}