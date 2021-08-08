import { prevent_default } from "svelte/internal";

export class ListNode<T> {
    public next: ListNode<T> | null = null;
    public prev: ListNode<T> | null = null;
    public val: T;

    constructor(val: T, next?: ListNode<T>|null, prev?: ListNode<T>|null) {
        this.val = val;
        if(next)
            this.next = next;
        if(prev)
            this.prev = prev;
    }
}

export interface ILinkedList<T> {
    insertAtBeginning(val: T): ListNode<T>;
    insertAtEnd(val: T): ListNode<T>;
    count(): number;
}

export class LinkedList<T> implements ILinkedList<T> {
    private _size: number = 0;
    private _head: ListNode<T> | null = null;
    private _tail: ListNode<T> | null = null;

    insertAtBeginning(val: T): ListNode<T> {
        ++this._size;
        let oldHead = this._head;
        this._head = new ListNode<T>(val, this._head);

        // first insert => tail = head
        if(oldHead === null) {
            this._tail = this._head;
        }
        // updating
        else {
            oldHead.prev = this._head;
        }

        return this._head;
    }


    insertAtEnd(val: T): ListNode<T> {
        ++this._size;
        let oldTail = this._tail;
        this._tail = new ListNode<T>(val, null, oldTail);

        // first insert
        if(oldTail === null) {
            this._head = this._tail;
        }
        else {
            oldTail.next = this._tail;
        }

        return this._tail;
    }
    
    
    count(): number {
        return this._size;
    }


    removeHead(): ListNode<T>|null {
        if(this._head === null) {
            return null;
        }
        
        let node = this._head;
        --this._size;

        this._head = this._head.next;
        if(this._head) {
            this._head.prev = null
        }

        node.next = null;

        return node;
    }


    removeTail(): ListNode<T>|null {
        if(this._tail === null) {
            return null;
        }
        
        let node = this._tail;
        --this._size;

        this._tail = this._tail.prev;
        if(this._tail) {
            this._tail.next = null
        }

        node.prev = null;

        return node;
    }


    getHeadVal(): T|null {
        if(this._head === null) {
            return null;
        }
        
        return this._head.val;
    }


    getTailVal(): T|null {
        if(this._tail === null) {
            return null;
        }

        return this._tail.val;
    }
}