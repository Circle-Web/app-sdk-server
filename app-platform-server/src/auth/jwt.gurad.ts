import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly options = {
            match: /^\/api/,
            getMatch: [/^\/api(.*)(\/sign-ext)(\/)/],
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
        let res = super.canActivate(context)
        for (const e of this.options.getMatch) {
            if (e.test(requestUrl)) {
                res = true
            }
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
        return res;
    }

    handleRequest(err, user, info: any, context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const requestUrl = request.url;
        if (this.options.ignoreApi.filter(api => requestUrl.includes(api)).length) {
            return user;
        }
        for (const e of this.options.getMatch) {
            if (e.test(requestUrl)) {
                return user;
            }
        }
        if (err || !user) {
            // jwt 只解决登录态问题 409
            throw new HttpException('登录态已失效', HttpStatus.CONFLICT);
        }
        return user;
    }
}