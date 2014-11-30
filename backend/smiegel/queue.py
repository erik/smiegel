import collections
import threading


class CyclicQueue:
    """
    A simple fixed-size queue that blocks on pop.

    There can be multiple writers, but only one thread should be calling pop at
    a time (since pop is a destructive operation)
    """

    DEFAULT_SIZE = 1000

    def __init__(self, size=DEFAULT_SIZE):
        self.queue = collections.deque([], size)
        self.event = threading.Event()

    def put(self, item):
        self.queue.append(item)
        self.event.set()

    def pop(self):
        try:
            self.event.clear()
            return self.queue.popleft()
        except IndexError:
            self.event.wait()
            return self.pop()

    def __iter__(self):
        return self

    def __next__(self):
        if len(self.queue) > 0:
            return self.pop()

        raise StopIteration

    def __len__(self):
        return len(self.queue)
