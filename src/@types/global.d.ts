// Info: https://www.typescriptlang.org/play?#code/C4TwDgpgBAEghgZwIICcDmCA8AVKEAewEAdgCYJQAUAdLXOggFxRzEgCUUAvAHwtt8uUAAr04AWwhEUWbHwJEyFANqsQAGii1qagLpQA-CLGTpsvs2IQAbhBQBuAFCPQkWIm7vkDTK4gB7ADMoAAtEVAweF3BoADl-T3hvDF8YoKhifwiEKMdAgFdiAGNgAEt-YlDwhkowE2YEYBRS4jROAG9HKG6oFCl8lEqAIiGnAF88wpLyyszsyg6unr7gAeHRxwnnAuKyiqgikIgigGsAJQgAR3zSvtJsnDxCEnIqbXoMZjVOXn4QHkogWIzGwmneDGYSQeckWPV6-UGGXyABtkeNnIdjucrjc7vMwskEJoRuxHJjThdrrcIPcanMGMShuwgA
type HasArgs<T extends (...args: any) => any> = Parameters<T> extends [any, ...any] ? Parameters<T> : never;

type MaybeParameters<T extends (...args: any) => any> = Parameters<T> extends [any, ...any] ? Parameters<T> : any;

type PromiseFnc = (...args: any[]) => Promise<any>

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

type ReturnType<T extends (...args: any[]) => any> =
    T extends (...args: any[]) => infer R ? R : never;

type ReturnTypeP<T extends (...args: any[]) => any> = ThenArg<ReturnType<T>>