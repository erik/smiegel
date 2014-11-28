import collections
import threading


message_queues = {}


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
            return self.queue.pop()
        except IndexError:
            self.event.wait()
            return self.pop()

    def __len__(self):
        return len(self.queue)


class Publisher:
    """beep boop skiddly bop"""

    def __init__(self):
        self.topics = {}

    def publish(self, topic, msg):
        if topic not in self.topics:
            self.topics[topic] = {
                'queue': CyclicQueue(),
                'subs': []
            }

        topic = self.topics[topic]

        if len(topic['subs']) > 0:
            for sub in topic['subs']:
                sub.put(msg)
        else:
            topic['queue'].put(msg)

    def subscribe(self, topic, queue):
        if topic not in self.topics:
            self.topics[topic] = {
                'queue': CyclicQueue(),
                'subs': []
            }

        topic = self.topics[topic]

        while len(topic['queue']) > 0:
            queue.put(topic['queue'].pop())

        topic['subs'].append(queue)

    def unsubscribe(self, topic, queue):
        if topic not in self.topics:
            return

        self.topics[topic]['subs'].remove(queue)


publisher = Publisher()
