import { Logger } from "@nestjs/common";

export class RateLimitService {
    rateLimit = 2000
    lastReqDate: Date = null

    private readonly logger = new Logger(RateLimitService.name);
    refreshRateLimit() {
        const now = new Date()
        const diff = +now - +this.lastReqDate
        if (this.lastReqDate && diff < this.rateLimit) {
            this.logger.log(`限速器正在工作，本次请求第三方服务不处理`)
            return false
        }
        this.lastReqDate = now
        return true
    }
}