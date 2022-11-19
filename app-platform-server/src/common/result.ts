import { RESULT_CODE } from "./resultCode"

export class Result<T> {
    public static SUCCESS_CODE = 0

    private code: number
    private msg: string
    private value: T

    constructor(code: number, value?: T) {
        this.code = code
        this.msg = RESULT_CODE[`${code}`] ?? ""
        this.value = value ?? null
    }

    public getCode() {
        return this.code;
    }

    public getValue() {
        return this.value;
    }

    public success() {
        return this.code == Result.SUCCESS_CODE;
    }

    public error() {
        return !this.success();
    }

}
