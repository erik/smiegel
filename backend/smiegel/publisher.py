from smiegel.queue import CyclicQueue


class Publisher:
    """TODO: documentation"""

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

        for msg in topic['queue']:
            queue.put(msg)

        topic['subs'].append(queue)

    def unsubscribe(self, topic, queue):
        if topic not in self.topics:
            return

        self.topics[topic]['subs'].remove(queue)
