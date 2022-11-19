import { Result } from "./result";

export class ResultFactory {

    /**
     * 创建一个成功的Result
     *
     * @param value 结果值
     */
    public static success<T>(value?: T) {
        return new Result<T>(Result.SUCCESS_CODE, value);
    }

    /**
     * 创建一个Result。
     */
    public static create<T>(code: number, value?: T) {
        return new Result<T>(code, value);
    }

}
