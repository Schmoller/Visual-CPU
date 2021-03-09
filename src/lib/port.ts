import { Node } from './node'

export interface Port {
    name: string
    type: string
    link: [Node, Port] | null
    reverseLink: [Node, Port] | null
    side: 'top' | 'bottom' | 'left' | 'right'
    slot: number
}

export interface InputPort extends Port {
    type: 'input'
}

export interface OutputPort extends Port {
    type: 'output'
}

export interface BiDiPort extends Port {
    type: 'bidi'
}
