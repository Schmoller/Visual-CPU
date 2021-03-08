import { Node } from './node'

export interface Port {
    name: string
    type: string
    linked: [Node, Port] | null
    relX: number
    relY: number
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
