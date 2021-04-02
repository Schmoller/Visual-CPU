import type { Node } from '../node'
import { TestNode } from './test'
import { BusOutputNode, BusDisplayNode } from './testing'
export type { MetaData } from './common'
export { TestNode, BusOutputNode, BusDisplayNode }

export const AllTypes = [TestNode, BusOutputNode, BusDisplayNode]

export function createNodeFromId(id: string, x: number, y: number): Node | null {
    for (const type of AllTypes) {
        const metadata = type.metadata()
        if (metadata.id === id) {
            return new type(x, y)
        }
    }
    return null
}
