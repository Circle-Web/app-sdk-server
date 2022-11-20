
export class Result<T> {
    public static SUCCESS_CODE = 0

    private code: number
    private msg: string
    private value: T

    constructor(code: number, msg?: string, value?: T) {
        this.code = code
        this.msg = msg ?? ""
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
