import { BinaryPort } from './common'

export class InputPort extends BinaryPort {
    canInput(): boolean {
        return true
    }

    canOutput(): boolean {
        return false
    }

    glyph(): string {
        return 'I'
    }
}

export class OutputPort extends BinaryPort {
    value: boolean = false

    canInput(): boolean {
        return false
    }

    canOutput(): boolean {
        return true
    }

    assertValue(value: boolean) {
        this.value = value
    }

    getValue(): boolean {
        return this.value
    }

    glyph(): string {
        return 'O'
    }
}

export class BiDiPort extends BinaryPort {
    value: boolean = false
    output: boolean = false

    canInput(): boolean {
        return true
    }

    canOutput(): boolean {
        return true
    }

    assertValue(value: boolean) {
        this.value = value
        // do we set the output to true
    }

    getValue(): boolean {
        if (this.output) {
            return this.value
        } else {
            return false
        }
    }

    glyph(): string {
        return 'X'
    }
}
