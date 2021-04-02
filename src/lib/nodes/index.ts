import type { Node } from '../node'
import { TestNode } from './test'
export type { MetaData } from './common'
export { TestNode }

export const AllTypes = [TestNode]

export function createNodeFromId(id: string, x: number, y: number): Node | null {
    for (const type of AllTypes) {
        const metadata = type.metadata()
        if (metadata.id === id) {
            return new type(x, y)
        }
    }
    return null
}
