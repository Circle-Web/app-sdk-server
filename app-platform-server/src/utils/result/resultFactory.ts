import { Result } from "./result";
import { codeMap, ResultCode } from "./resultCode";

export class ResultFactory {

    /**
     * 创建一个成功的Result
     *
     * @param value 结果值
     */
    public static success<T>(value?: T) {
        return this.create(ResultCode.SUCCESS, value);
    }

    /**
     * 创建一个Result。
     */
    public static create<T>(code: ResultCode, value?: T) {
        return new Result<T>(code, codeMap[code], value);
    }

}
