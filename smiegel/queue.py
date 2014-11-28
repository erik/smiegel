import queue


class Queue:

    def __init__(user):
        self.queue = queue.Queue()
        self.socket = None

    def put(item):
        if self.socket:
            self.socket.put(item)

        else:
            self.queue.put(item)

    def add_socket(socket):
        self.socket = socket

        while self.queue.size() > 0:
            self.socket.put(self.queue.get())
