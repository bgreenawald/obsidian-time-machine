import DateMinHeap from "./heap";
import DateFile from "./dateFile";

// Mock TFile for testing
class MockTFile {
    path: string;
    basename: string;
    constructor(path: string) {
        this.path = path;
        this.basename = path.split("/").pop() || path;
    }
}

describe("DateMinHeap", () => {
    function makeDateFile(dateString: string, path: string) {
        return new DateFile(new MockTFile(path) as any, Promise.resolve(""), new Date(dateString));
    }

    it("should add items and keep only the most recent N", () => {
        const heap = new DateMinHeap(3);
        heap.add(makeDateFile("2020-01-01", "a.md"));
        heap.add(makeDateFile("2021-01-01", "b.md"));
        heap.add(makeDateFile("2022-01-01", "c.md"));
        heap.add(makeDateFile("2023-01-01", "d.md")); // Should push out the oldest
        expect(heap.heap.length).toBe(3);
        expect(heap.heap.map(f => f.file.basename)).toContain("d.md");
        expect(heap.heap.map(f => f.file.basename)).not.toContain("a.md");
    });

    it("should return the oldest date at the top", () => {
        const heap = new DateMinHeap(2);
        heap.add(makeDateFile("2021-01-01", "a.md"));
        heap.add(makeDateFile("2022-01-01", "b.md"));
        expect(heap.peek()?.file.basename).toBe("a.md");
    });

    it("should remove the top item", () => {
        const heap = new DateMinHeap(2);
        heap.add(makeDateFile("2021-01-01", "a.md"));
        heap.add(makeDateFile("2022-01-01", "b.md"));
        const removed = heap.remove();
        expect(removed?.file.basename).toBe("a.md");
        expect(heap.heap.length).toBe(1);
    });

    it("should print the heap as a string", () => {
        const heap = new DateMinHeap(2);
        heap.add(makeDateFile("2021-01-01", "a.md"));
        heap.add(makeDateFile("2022-01-01", "b.md"));
        const str = heap.printHeap();
        expect(typeof str).toBe("string");
        expect(str).toContain("a.md");
        expect(str).toContain("b.md");
    });
});
