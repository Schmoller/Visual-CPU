import type { Node } from '../node'
import { NotNode, AndNode, OrNode, XorNode } from './logic'

import { TestNode } from './test'
import { BusOutputNode, BusDisplayNode } from './testing'
import type { MetaData } from './common'
export type { MetaData } from './common'
export { TestNode, BusOutputNode, BusDisplayNode, NotNode, AndNode, OrNode, XorNode }
interface NodeType {
    createExample: () => Node
    metadata: () => MetaData

    new (x: number, y: number): Node
}

export const AllTypes: NodeType[] = [TestNode, BusOutputNode, BusDisplayNode, NotNode, AndNode, OrNode, XorNode]

export function createNodeFromId(id: string, x: number, y: number): Node | null {
    for (const type of AllTypes) {
        const metadata = type.metadata()
        if (metadata.id === id) {
            return new type(x, y)
        }
    }
    return null
}
