const modules = [
  {
    id: 'welcome',
    title: 'Welcome to System Design',
    description: 'Learn what system design is and how the web works under the hood.',
    difficulty: 'beginner',
    estimatedMinutes: 20,
    lessons: [
      {
        id: 'what-is-system-design',
        title: 'What is System Design?',
        content: `System design is the process of defining the architecture, components, modules, interfaces, and data flow of a system to satisfy specified requirements.

Think of it like designing a building before construction. An architect plans where rooms go, how people move between floors, where plumbing and electricity run. Similarly, a system designer plans how software components interact, how data flows, and how the system handles growth.

**Key concepts you will learn:**
• Components — the pieces of your system (servers, databases, caches)
• Communication — how components talk to each other (APIs, messages)
• Scalability — how your system grows with more users
• Reliability — keeping the system working despite failures`,
        takeaways: [
          'System design is about planning software architecture before building it',
          'Components, communication, scalability, and reliability are the four pillars',
          'Good design prevents costly rework later',
        ],
        quiz: [
          {
            question: 'What is system design?',
            options: ['Writing code for a single function', 'Planning the architecture of a software system', 'Testing a completed application', 'Deploying code to production'],
            correct: 1,
            explanation: 'System design is the process of planning the architecture, components, and data flow before building.',
          },
          {
            question: 'Which is NOT one of the four pillars mentioned?',
            options: ['Components', 'Communication', 'Cost', 'Scalability'],
            correct: 2,
            explanation: 'The four pillars are Components, Communication, Scalability, and Reliability — Cost is a consideration but not one of the four pillars.',
          },
        ],
      },
      {
        id: 'how-web-works',
        title: 'How the Web Works',
        content: `When you type a URL into your browser, a lot happens in seconds:

1. **DNS Lookup** — Your browser asks a DNS server "Where is google.com?" and gets back an IP address like 142.250.80.46
2. **TCP Connection** — Your browser opens a connection to that server
3. **HTTP Request** — Your browser sends a request: "Give me the homepage"
4. **Server Processing** — The server processes your request, possibly querying a database
5. **HTTP Response** — The server sends back HTML, CSS, and JavaScript
6. **Rendering** — Your browser renders the page

**Real-world complexity:** A single page often involves dozens of servers — CDNs for static files, API servers for data, databases for storage, and more.`,
        takeaways: [
          'The web uses a request-response model between clients and servers',
          'DNS translates domain names to IP addresses',
          'HTTP is the language browsers and servers use to communicate',
        ],
        quiz: [
          {
            question: 'What does DNS do?',
            options: ['Encrypts web traffic', 'Translates domain names to IP addresses', 'Hosts website files', 'Load balances traffic'],
            correct: 1,
            explanation: 'DNS (Domain Name System) translates human-readable domain names like google.com into machine-readable IP addresses.',
          },
          {
            question: 'What protocol do browsers use to request web pages?',
            options: ['FTP', 'SMTP', 'HTTP', 'WebSocket'],
            correct: 2,
            explanation: 'HTTP (HyperText Transfer Protocol) is the protocol browsers use to request and receive web pages from servers.',
          },
        ],
      },
      {
        id: 'client-server',
        title: 'Client-Server Architecture',
        content: `The **client-server model** is the foundation of modern web applications.

• **Client** — The frontend (browser, mobile app) that users interact with
• **Server** — The backend that processes logic, stores data, and serves responses

**How it works:**
\`\`\`
Client (Browser)  ──Request──►  Server (Backend)
                   ◄──Response──
\`\`\`

**Simple example — A todo app:**
• Client shows checkboxes and an input field
• When you add a task, the client sends "CREATE task 'Buy milk'" to the server
• The server saves it to a database and sends back confirmation
• The client updates the UI

One server can serve many clients, and one client can talk to many servers.`,
        takeaways: [
          'Clients request data; servers process and respond',
          'This separation allows independent scaling of frontend and backend',
          'Modern apps often have multiple specialized servers',
        ],
        quiz: [
          {
            question: 'In client-server architecture, what is the client?',
            options: ['The database', 'The frontend the user interacts with', 'The backend processing logic', 'The network router'],
            correct: 1,
            explanation: 'The client is the frontend (browser or mobile app) that users interact with directly.',
          },
          {
            question: 'What is a key benefit of separating client and server?',
            options: ['Faster internet speeds', 'They can scale independently', 'No need for databases', 'Simpler code'],
            correct: 1,
            explanation: 'Separating client and server allows each to be scaled, updated, and maintained independently.',
          },
        ],
      },
      {
        id: 'your-first-architecture',
        title: 'Your First Architecture',
        content: `Let's build your first mental model of a system architecture.

**A basic web application has three tiers:**

\`\`\`
[Browser]  ←→  [Web Server]  ←→  [Database]
\`\`\`

**Each part has a job:**
1. **Browser (Client)** — Renders HTML, runs JavaScript, makes API calls
2. **Web Server** — Handles requests, runs business logic, talks to the database
3. **Database** — Stores and retrieves data persistently

**Example — A blog platform:**
• Browser shows the blog homepage
• Web server fetches recent posts from the database
• Web server formats them as HTML and sends to the browser
• When you write a new post, the server saves it to the database

This three-tier pattern is the foundation you will build upon as you learn more advanced concepts like caching, load balancing, and microservices.`,
        takeaways: [
          'Most web apps follow a three-tier pattern: Client → Server → Database',
          'Each tier has a specific responsibility',
          'This pattern is the foundation for all more complex architectures',
        ],
        quiz: [
          {
            question: 'What are the three tiers of a basic web application?',
            options: ['HTML, CSS, JavaScript', 'Client, Server, Database', 'Frontend, Backend, DevOps', 'Development, Staging, Production'],
            correct: 1,
            explanation: 'The three tiers are Client (browser), Server (backend), and Database (storage).',
          },
          {
            question: 'What is the server responsible for in a three-tier architecture?',
            options: ['Rendering the UI', 'Running business logic and handling requests', 'Storing data permanently', 'Managing DNS'],
            correct: 1,
            explanation: 'The server handles business logic, processes requests from the client, and communicates with the database.',
          },
        ],
      },
    ],
  },
  {
    id: 'core-building-blocks',
    title: 'Core Building Blocks',
    description: 'Understand servers, APIs, databases, and caching — the components every system uses.',
    difficulty: 'beginner',
    estimatedMinutes: 25,
    lessons: [
      {
        id: 'servers-services',
        title: 'Servers and Services',
        content: `A **server** is a computer program that provides functionality to other programs (clients).

**Types of servers you should know:**
• **Web Server** — Serves web pages (e.g., Nginx, Apache)
• **Application Server** — Runs your business logic (e.g., Node.js, Django, Spring)
• **Database Server** — Stores and manages data (e.g., PostgreSQL, MongoDB)
• **File Server** — Stores and serves files (e.g., AWS S3)

**Service vs Server:** A service is a specific capability (like "user authentication"), while a server is the machine or process that hosts one or more services.

**Modern approach:** Instead of one giant server doing everything, applications now use multiple specialized services that each do one thing well — this is called **microservices**.`,
        takeaways: [
          'Servers provide functionality to clients over a network',
          'Different types of servers handle different responsibilities',
          'Services are specific capabilities; servers host services',
        ],
        quiz: [
          {
            question: 'What is the primary role of an application server?',
            options: ['Serve static files', 'Run business logic', 'Store data', 'Manage DNS'],
            correct: 1,
            explanation: 'An application server runs your business logic — the core functionality of your application.',
          },
          {
            question: 'What does the term "microservices" refer to?',
            options: ['Very small servers', 'Multiple specialized services working together', 'Tiny databases', 'Minimal code'],
            correct: 1,
            explanation: 'Microservices is an architecture where an application is built as a collection of small, specialized, independent services.',
          },
        ],
      },
      {
        id: 'apis-communication',
        title: 'APIs and Communication',
        content: `An **API** (Application Programming Interface) defines how different software components should communicate.

**Think of an API like a restaurant menu:**
• The menu lists what you can order (available requests)
• You tell the waiter your order (send a request)
• The kitchen prepares your food (server processes)
• The waiter brings it to you (response)

**Common API styles:**
\`\`\`
REST:    GET /api/users        — List users
         POST /api/users       — Create a user
         GET /api/users/1      — Get user by ID
         
GraphQL: query { users { name } }  — Ask for specific data

gRPC:    Defined by .proto files, faster, binary format
\`\`\`

**Real-time communication** uses WebSockets — a persistent connection where both sides can send messages anytime (think chat apps, live notifications).`,
        takeaways: [
          'APIs define how components communicate',
          'REST is the most common API style — uses HTTP methods (GET, POST, PUT, DELETE)',
          'WebSockets enable real-time two-way communication',
        ],
        quiz: [
          {
            question: 'What does API stand for?',
            options: ['Application Programming Interface', 'Automated Program Integration', 'Advanced Protocol Interface', 'Application Process Integration'],
            correct: 0,
            explanation: 'API stands for Application Programming Interface — it defines how software components communicate.',
          },
          {
            question: 'Which API style is best for real-time chat applications?',
            options: ['REST', 'GraphQL', 'WebSockets', 'SOAP'],
            correct: 2,
            explanation: 'WebSockets maintain a persistent connection for real-time two-way communication, ideal for chat apps.',
          },
        ],
      },
      {
        id: 'databases-explained',
        title: 'Databases Explained',
        content: `A **database** stores data persistently so it can be retrieved later.

**Two main types:**

**1. Relational (SQL) Databases** — Like spreadsheets with rows and columns
• Examples: PostgreSQL, MySQL, SQLite
• Best for: Structured data with relationships (users, orders, products)
• Uses tables with strict schemas

\`\`\`
Table: Users
| id | name  | email           |
|----|-------|-----------------|
| 1  | Alice | alice@email.com |
| 2  | Bob   | bob@email.com   |
\`\`\`

**2. NoSQL Databases** — More flexible, no fixed schema
• Examples: MongoDB (document), Redis (key-value), Cassandra (wide-column)
• Best for: Unstructured data, high-speed lookups, large-scale systems

**Choosing a database:**
• Need transactions and relationships? → PostgreSQL
• Need fast key-value lookups? → Redis
• Need flexible document storage? → MongoDB
• Need full-text search? → Elasticsearch`,
        takeaways: [
          'Relational databases use tables with strict schemas (SQL)',
          'NoSQL databases offer flexibility and specialized use cases',
          'Choose your database based on your data shape and access patterns',
        ],
        quiz: [
          {
            question: 'Which type of database uses tables with rows and columns?',
            options: ['NoSQL', 'Relational (SQL)', 'Key-value', 'Graph'],
            correct: 1,
            explanation: 'Relational databases organize data into tables with rows and columns, like a spreadsheet.',
          },
          {
            question: 'When would you choose Redis over PostgreSQL?',
            options: ['When you need complex queries', 'When you need fast key-value lookups', 'When you need transactions', 'When data relationships are complex'],
            correct: 1,
            explanation: 'Redis is ideal for fast, simple key-value lookups (caching, sessions) rather than complex relational queries.',
          },
        ],
      },
      {
        id: 'caching-basics',
        title: 'Caching Basics',
        content: `A **cache** stores copies of frequently accessed data in a fast storage layer, reducing the need to fetch from the original source.

**Why caching matters:**
• Reading from memory is 100-1000x faster than reading from disk
• Reduces database load
• Improves response times for users

**Common caching strategies:**

\`\`\`
Browser Cache:    [Browser] stores images, CSS, JS locally
CDN Cache:        [Edge Server] stores static files close to users
Application Cache: [Redis/Memcached] stores API responses
Database Cache:   [DB Buffer Pool] stores frequently queried rows
\`\`\`

**Example — Social media feed:**
1. User opens app → fetch 20 most recent posts from Redis (fast!)
2. If not in cache → fetch from database, store in Redis for next time
3. New post → update Redis and database simultaneously

**Cache Invalidation** is the hard part — ensuring cached data is up-to-date when the original data changes.`,
        takeaways: [
          'Caching stores copies of data in fast storage for quicker access',
          'Caches can be placed at multiple levels (browser, CDN, app, database)',
          'Cache invalidation is one of the hardest problems in computing',
        ],
        quiz: [
          {
            question: 'What is the main benefit of caching?',
            options: ['Uses more memory', 'Faster data retrieval and reduced load', 'Simpler code', 'More reliable storage'],
            correct: 1,
            explanation: 'Caching improves speed by serving data from fast memory instead of slower sources, and reduces load on backend systems.',
          },
          {
            question: 'What is "cache invalidation"?',
            options: ['Setting up a cache for the first time', 'Removing or updating cached data when original data changes', 'Measuring cache performance', 'Encrypting cached data'],
            correct: 1,
            explanation: 'Cache invalidation is the process of keeping cached data up-to-date when the source data changes — a famously difficult problem.',
          },
        ],
      },
    ],
  },
  {
    id: 'designing-first-system',
    title: 'Designing Your First System',
    description: 'Apply what you have learned to design a complete web application.',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    lessons: [
      {
        id: 'planning-web-app',
        title: 'Planning a Web Application',
        content: `Before diving into architecture, gather requirements:

**Step 1: Define the purpose**
• What does the system do? (e.g., "A platform for sharing short messages")
• Who uses it? (users, admins, anonymous visitors)
• What are the core features? (post messages, follow users, timeline)

**Step 2: Estimate scale**
• How many users? (100? 10,000? 1 million?)
• How much data? (text only? images? videos?)
• Growth rate? (doubling monthly? staying steady?)

**Step 3: Identify components**
• User service — registration, login, profiles
• Content service — posts, feeds, search
• Notification service — alerts, emails

**Step 4: Sketch the architecture**
\`\`\`
[Users] → [Load Balancer] → [Web Server] → [Database]
                                        ↘ [Cache]
\`\`\`

Good planning prevents 80% of architecture problems before they happen.`,
        takeaways: [
          'Start by defining purpose, users, and core features',
          'Estimate scale to choose the right architecture',
          'Identify logical components before drawing the diagram',
        ],
        quiz: [
          {
            question: 'What should you do FIRST when designing a system?',
            options: ['Choose a database', 'Define purpose and requirements', 'Write code', 'Set up servers'],
            correct: 1,
            explanation: 'Always start by understanding what the system needs to do — requirements drive all architecture decisions.',
          },
          {
            question: 'Why is estimating scale important?',
            options: ['It is not important for most systems', 'It determines database and infrastructure choices', 'It only matters for big companies', 'It affects the UI design'],
            correct: 1,
            explanation: 'Scale estimates help you choose appropriate technologies — a system for 100 users is very different from one for 1 million users.',
          },
        ],
      },
      {
        id: 'component-architecture',
        title: 'Component Architecture',
        content: `Once you have requirements, break the system into **components**.

**What is a component?** A self-contained unit with a specific responsibility.

**Example — URL Shortener (like TinyURL):**

\`\`\`
Components:
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│  API Gateway │───►│  URL Service  │───►│  Database     │
└─────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Cache       │
                    └──────────────┘
\`\`\`

**Each component has:**
• **Name** — Unique identifier (e.g., "url-service")
• **Type** — What kind (microservice, database, cache, load balancer)
• **Responsibility** — What it does (e.g., "Generates unique short URLs")

**Good component design rules:**
• **Single Responsibility** — Each component does ONE thing well
• **Loose Coupling** — Components should not depend heavily on each other
• **High Cohesion** — Related functionality stays together`,
        takeaways: [
          'Components are self-contained units with specific responsibilities',
          'Follow single responsibility, loose coupling, and high cohesion',
          'Draw a diagram to visualize component relationships',
        ],
        quiz: [
          {
            question: 'What does "single responsibility" mean for a component?',
            options: ['It can do many things', 'It should do one thing well', 'It should be the only component', 'It handles all user requests'],
            correct: 1,
            explanation: 'Single responsibility means each component should have one clear purpose and do it well.',
          },
          {
            question: 'What is "loose coupling"?',
            options: ['Components are tightly connected', 'Components have minimal dependencies on each other', 'Components share the same database', 'Components are in the same server'],
            correct: 1,
            explanation: 'Loose coupling means components are independent and changes to one component do not require changes to others.',
          },
        ],
      },
      {
        id: 'data-flow-design',
        title: 'Data Flow Design',
        content: `**Data flow** describes how information moves through your system.

**Types of communication:**

\`\`\`
Synchronous (Request-Response):
Client ──Request──► Server
        ◄──Response──

Asynchronous (Message Queue):
Producer ──Message──► [Queue] ──Message──► Consumer
\`\`\`

**When to use each:**
• **Synchronous** — When you need an immediate answer (loading a page, checking out)
• **Asynchronous** — When speed matters or the task can wait (sending emails, processing images)

**Example — E-commerce checkout flow:**
1. User clicks "Buy" → synchronous: validate cart, process payment
2. After payment → asynchronous: send confirmation email, update inventory, trigger shipping

**Data flow diagram for a blog:**
\`\`\`
[Browser] → GET /posts → [Web Server] → SELECT * FROM posts → [Database]
                                              │
                                    Format as JSON (HTML)
                                              │
[Browser] ← HTML page ← [Web Server] ←──────┘
\`\`\``,
        takeaways: [
          'Data can flow synchronously (wait for response) or asynchronously (fire and forget)',
          'Choose communication style based on whether you need an immediate response',
          'Draw data flow diagrams to understand how information moves through components',
        ],
        quiz: [
          {
            question: 'When should you use asynchronous communication?',
            options: ['When you need an immediate response', 'For background tasks that can wait', 'For all database queries', 'For user authentication'],
            correct: 1,
            explanation: 'Asynchronous communication is ideal for background tasks like sending emails or processing images where the user does not need to wait.',
          },
          {
            question: 'What is an example of synchronous communication?',
            options: ['Sending a notification email', 'Processing a video upload', 'Loading a web page', 'Generating a report'],
            correct: 2,
            explanation: 'Loading a web page is synchronous — the browser sends a request and waits for the server to respond before rendering.',
          },
        ],
      },
      {
        id: 'putting-together',
        title: 'Putting It All Together',
        content: `Now you have all the pieces. Let's design a **social media feed system** from scratch:

**Requirements:**
• Users can post text messages
• Users follow other users
• The feed shows recent posts from followed users
• 1 million active users

**Architecture:**
\`\`\`
[Browser] → [CDN] → [Load Balancer] → [API Gateway]
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
            [User Service]          [Post Service]          [Feed Service]
                    │                       │                       │
                    ▼                       ▼                       ▼
            [User DB (SQL)]     [Post DB (SQL)]            [Feed Cache (Redis)]
                                                                   │
                                                    ┌──────────────┘
                                                    ▼
                                            [Notification Queue]
                                                    │
                                                    ▼
                                            [Email Worker]
\`\`\`

**Key decisions:**
• **Separate services** for users, posts, and feeds (microservices)
• **SQL databases** for user and post data (structured, relational)
• **Redis cache** for pre-computed feeds (fast reads)
• **Message queue** for notifications (async, no blocking)

**This is real-world system design** — making trade-offs between performance, complexity, and cost.`,
        takeaways: [
          'Real architectures combine multiple patterns and technologies',
          'Separate concerns into different services for scalability',
          'Use caches and queues to handle scale',
          'Every design involves trade-offs',
        ],
        quiz: [
          {
            question: 'Why use a cache for the feed service?',
            options: ['To store user passwords', 'To pre-compute and serve feeds quickly', 'To replace the database', 'To send notifications'],
            correct: 1,
            explanation: 'Pre-computing feeds and storing them in Redis allows lightning-fast retrieval instead of querying and joining multiple tables for every request.',
          },
          {
            question: 'What is the benefit of separating User, Post, and Feed into different services?',
            options: ['More complex code', 'Each can be scaled independently', 'They cannot communicate', 'Uses more servers'],
            correct: 1,
            explanation: 'Separate services (microservices) can be scaled, deployed, and maintained independently based on their specific load.',
          },
        ],
      },
    ],
  },
  {
    id: 'scaling-patterns',
    title: 'Scaling & Real-World Patterns',
    description: 'Learn how systems handle millions of users and explore proven architecture patterns.',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    lessons: [
      {
        id: 'why-scaling',
        title: 'Why Scaling Matters',
        content: `**Scaling** is making your system handle more users, data, or traffic.

**Vertical Scaling (Scale Up):**
• Add more power to your existing server (more RAM, faster CPU)
• Simple but has a physical limit
• Expensive at high specs

**Horizontal Scaling (Scale Out):**
• Add more servers to share the load
• No theoretical limit
• Requires load balancing

\`\`\`
Vertical:   [1 Big Server]
Horizontal: [Server A] [Server B] [Server C] ← Load Balancer
\`\`\`

**The goal of good system design:** Build systems that can scale horizontally from day one.

**The CAP Theorem:** In distributed systems, you can only have two of three: Consistency, Availability, Partition Tolerance. Choose the right trade-off for your use case.`,
        takeaways: [
          'Vertical scaling = bigger servers; Horizontal scaling = more servers',
          'Horizontal scaling is more flexible but requires smart architecture',
          'CAP theorem guides distributed system design trade-offs',
        ],
        quiz: [
          {
            question: 'What is horizontal scaling?',
            options: ['Adding more RAM to a server', 'Adding more servers to share the load', 'Upgrading the CPU', 'Using a faster database'],
            correct: 1,
            explanation: 'Horizontal scaling means adding more servers to distribute the workload across multiple machines.',
          },
          {
            question: 'What does the CAP theorem describe?',
            options: ['How to cache data', 'Trade-offs in distributed systems', 'How databases work', 'Load balancing strategies'],
            correct: 1,
            explanation: 'CAP theorem states that distributed systems can only guarantee two of three: Consistency, Availability, and Partition Tolerance.',
          },
        ],
      },
      {
        id: 'load-balancers',
        title: 'Load Balancers & Horizontal Scaling',
        content: `A **load balancer** distributes incoming traffic across multiple servers.

**How it works:**
\`\`\`
Users ──► [Load Balancer] ──► [Server A]
                            ──► [Server B]
                            ──► [Server C]
\`\`\`

**Load balancing algorithms:**
• **Round Robin** — Alternates between servers (simple, fair)
• **Least Connections** — Sends to the server with fewest active connections
• **IP Hash** — Same user always goes to the same server (useful for sessions)

**Health checks** — The load balancer periodically checks if servers are alive. If a server fails, traffic is redirected to healthy ones.

**Auto-scaling** — Cloud providers can automatically add servers when traffic spikes and remove them when it drops, saving money.

**Session affinity (sticky sessions)** — Some apps store session data on a specific server. This can cause problems if that server goes down. Better to store sessions in a shared cache (Redis).`,
        takeaways: [
          'Load balancers distribute traffic across multiple servers',
          'Different algorithms suit different use cases',
          'Combine load balancers with auto-scaling for cost-efficient scaling',
          'Use shared caches for sessions instead of sticky sessions',
        ],
        quiz: [
          {
            question: 'What happens if a server behind a load balancer fails?',
            options: ['The whole system goes down', 'The load balancer redirects traffic to healthy servers', 'Users get an error', 'The load balancer fails too'],
            correct: 1,
            explanation: 'Load balancers perform health checks and automatically route traffic away from failed servers to healthy ones.',
          },
          {
            question: 'What is auto-scaling?',
            options: ['Manually adding servers', 'Automatically adding/removing servers based on demand', 'Scaling the database', 'Using bigger servers'],
            correct: 1,
            explanation: 'Auto-scaling automatically adjusts the number of servers based on current traffic, optimizing cost and performance.',
          },
        ],
      },
      {
        id: 'microservices-intro',
        title: 'Microservices Introduction',
        content: `**Monolithic architecture:** One big application that does everything.

\`\`\`
[Monolith] — User auth, payments, inventory, shipping — ALL IN ONE
\`\`\`

**Microservices architecture:** Many small, independent services.

\`\`\`
[Auth Service]  [Payment Service]  [Inventory Service]  [Shipping Service]
      │                 │                  │                    │
      └─────────────────┴──────────────────┴────────────────────┘
                              │
                         [API Gateway]
                              │
                         [Browser/App]
\`\`\`

**Benefits of microservices:**
• **Independent scaling** — Scale only the services that need it
• **Independent deployment** — Update one service without affecting others
• **Technology diversity** — Use the best language/database for each service
• **Fault isolation** — One service failing does not take down the whole system

**Challenges:**
• **Complexity** — More moving parts to manage
• **Communication** — Services must talk over a network (slower than in-process)
• **Data consistency** — Each service has its own database
• **Debugging** — Harder to trace requests across multiple services`,
        takeaways: [
          'Microservices break an application into small, independent services',
          'Benefits: independent scaling, deployment, and fault isolation',
          'Cost: increased complexity in communication, data management, and debugging',
        ],
        quiz: [
          {
            question: 'What is a key benefit of microservices over monoliths?',
            options: ['Simpler overall system', 'Each service can be scaled independently', 'Fewer servers needed', 'Single database for everything'],
            correct: 1,
            explanation: 'With microservices, you can scale only the services that need more resources, saving cost and improving performance.',
          },
          {
            question: 'What is a challenge of microservices?',
            options: ['All services must use the same language', 'Services cannot be deployed independently', 'Network communication adds complexity and latency', 'Smaller codebases'],
            correct: 2,
            explanation: 'Microservices communicate over a network, which adds latency and complexity compared to in-process calls in a monolith.',
          },
        ],
      },
      {
        id: 'real-world-patterns',
        title: 'Real-World Architecture Patterns',
        content: `Here are proven patterns used by major companies:

**1. CQRS (Command Query Responsibility Segregation)**
Separate the code that writes data (commands) from the code that reads data (queries).
• Used by: eBay, Amazon
• Benefit: Optimize reads and writes independently

**2. Event-Driven Architecture**
Components communicate by emitting and responding to events.
\`\`\`
[Order Service] ──"order.placed"──► [Event Bus]
                                         │
                          ┌──────────────┼──────────────┐
                          ▼              ▼              ▼
                   [Inventory]     [Shipping]     [Notifications]
\`\`\`
• Used by: Uber, Netflix
• Benefit: Highly decoupled, scalable

**3. Strangler Fig Pattern**
Gradually replace a legacy system by routing features one by one to a new system.
• Used by: Companies migrating from monoliths to microservices
• Benefit: Low-risk migration without downtime

**4. Circuit Breaker**
When a service fails, stop calling it for a while to let it recover.
• Used by: Netflix (Hystrix)
• Benefit: Prevents cascading failures`,
        takeaways: [
          'CQRS separates read and write operations for better performance',
          'Event-driven architecture decouples services through events',
          'Strangler Fig allows safe migration from legacy systems',
          'Circuit breakers prevent cascading failures',
        ],
        quiz: [
          {
            question: 'What does CQRS stand for?',
            options: ['Command Query Responsibility Segregation', 'Complete Query Response System', 'Continuous Query Routing Service', 'Centralized Queue Request System'],
            correct: 0,
            explanation: 'CQRS (Command Query Responsibility Segregation) separates write operations (commands) from read operations (queries).',
          },
          {
            question: 'What is the purpose of a circuit breaker pattern?',
            options: ['Make circuits faster', 'Prevent cascading failures by stopping calls to failing services', 'Route traffic to different servers', 'Cache database queries'],
            correct: 1,
            explanation: 'A circuit breaker monitors for failures and stops sending requests to a failing service, giving it time to recover and preventing failures from cascading.',
          },
        ],
      },
    ],
  },
];

const templates = [
  {
    id: 'basic-web-app',
    name: 'Basic Web Application',
    difficulty: 'beginner',
    description: 'A simple three-tier web app with a browser, server, and database. Perfect for learning the fundamentals.',
    useCase: 'Small blogs, landing pages, simple CRUD applications (< 10K users)',
    whenToUse: 'Use this when you are building a prototype or a simple application that does not need complex scaling.',
    considerations: 'As user count grows, you will need to add caching, a CDN, and eventually split the server into services.',
    nodes: [
      { id: 'browser', label: 'Browser', type: 'client', group: 'frontend' },
      { id: 'web-server', label: 'Web Server', type: 'service', group: 'backend' },
      { id: 'database', label: 'Database', type: 'database', group: 'storage' },
    ],
    edges: [
      { source: 'browser', target: 'web-server', label: 'HTTP', style: 'solid' },
      { source: 'web-server', target: 'database', label: 'SQL', style: 'solid' },
    ],
  },
  {
    id: 'api-service',
    name: 'API Service with Caching',
    difficulty: 'beginner',
    description: 'A backend API service with a Redis cache layer for faster responses.',
    useCase: 'Mobile app backends, REST APIs, data services (10K-100K users)',
    whenToUse: 'Use when your application has read-heavy workloads where users request the same data frequently.',
    considerations: 'Plan cache invalidation strategy. Use TTL (time-to-live) for automatic cache expiry.',
    nodes: [
      { id: 'client', label: 'Mobile/Web Client', type: 'client', group: 'frontend' },
      { id: 'api-gateway', label: 'API Gateway', type: 'gateway', group: 'backend' },
      { id: 'app-service', label: 'Application Service', type: 'service', group: 'backend' },
      { id: 'cache', label: 'Redis Cache', type: 'cache', group: 'storage' },
      { id: 'database', label: 'Database', type: 'database', group: 'storage' },
    ],
    edges: [
      { source: 'client', target: 'api-gateway', label: 'REST/GraphQL', style: 'solid' },
      { source: 'api-gateway', target: 'app-service', label: 'Internal', style: 'solid' },
      { source: 'app-service', target: 'cache', label: 'Read/Write', style: 'solid' },
      { source: 'app-service', target: 'database', label: 'Persist', style: 'dashed' },
    ],
  },
  {
    id: 'social-feed',
    name: 'Social Media Feed',
    difficulty: 'intermediate',
    description: 'A scalable social media feed system with pre-computed timelines and notifications.',
    useCase: 'Social networks, content platforms, news feeds (100K-10M users)',
    whenToUse: 'Use when users need personalized, real-time content feeds with social interactions.',
    considerations: 'Pre-compute feeds for active users. Use fanout-on-write for small audiences and fanout-on-read for large ones.',
    nodes: [
      { id: 'browser', label: 'Browser App', type: 'client', group: 'frontend' },
      { id: 'cdn', label: 'CDN', type: 'cache', group: 'frontend' },
      { id: 'lb', label: 'Load Balancer', type: 'gateway', group: 'infra' },
      { id: 'api', label: 'API Gateway', type: 'gateway', group: 'backend' },
      { id: 'user-svc', label: 'User Service', type: 'service', group: 'backend' },
      { id: 'post-svc', label: 'Post Service', type: 'service', group: 'backend' },
      { id: 'feed-svc', label: 'Feed Service', type: 'service', group: 'backend' },
      { id: 'user-db', label: 'User DB', type: 'database', group: 'storage' },
      { id: 'post-db', label: 'Post DB', type: 'database', group: 'storage' },
      { id: 'feed-cache', label: 'Feed Cache (Redis)', type: 'cache', group: 'storage' },
      { id: 'queue', label: 'Notification Queue', type: 'queue', group: 'backend' },
      { id: 'worker', label: 'Notification Worker', type: 'service', group: 'backend' },
    ],
    edges: [
      { source: 'browser', target: 'cdn', label: 'Static Assets', style: 'solid' },
      { source: 'browser', target: 'lb', label: 'HTTP', style: 'solid' },
      { source: 'lb', target: 'api', label: 'Internal', style: 'solid' },
      { source: 'api', target: 'user-svc', label: 'Auth', style: 'solid' },
      { source: 'api', target: 'post-svc', label: 'Posts', style: 'solid' },
      { source: 'api', target: 'feed-svc', label: 'Feed', style: 'solid' },
      { source: 'user-svc', target: 'user-db', label: 'SQL', style: 'solid' },
      { source: 'post-svc', target: 'post-db', label: 'SQL', style: 'solid' },
      { source: 'feed-svc', target: 'feed-cache', label: 'Read', style: 'solid' },
      { source: 'post-svc', target: 'feed-cache', label: 'Write', style: 'dashed' },
      { source: 'post-svc', target: 'queue', label: 'Event', style: 'dashed' },
      { source: 'queue', target: 'worker', label: 'Process', style: 'solid' },
    ],
  },
  {
    id: 'ecommerce-cart',
    name: 'E-commerce Shopping Cart',
    difficulty: 'intermediate',
    description: 'An e-commerce system with cart management, inventory, and order processing.',
    useCase: 'Online stores, marketplaces, retail platforms (10K-1M users)',
    whenToUse: 'Use when you need to manage products, user carts, inventory, and order processing with transactional integrity.',
    considerations: 'Use Redis for cart data (fast, temporary) and SQL for orders (durable, transactional).',
    nodes: [
      { id: 'browser', label: 'Shopper Browser', type: 'client', group: 'frontend' },
      { id: 'cdn', label: 'CDN', type: 'cache', group: 'frontend' },
      { id: 'lb', label: 'Load Balancer', type: 'gateway', group: 'infra' },
      { id: 'api', label: 'API Gateway', type: 'gateway', group: 'backend' },
      { id: 'product-svc', label: 'Product Service', type: 'service', group: 'backend' },
      { id: 'cart-svc', label: 'Cart Service', type: 'service', group: 'backend' },
      { id: 'order-svc', label: 'Order Service', type: 'service', group: 'backend' },
      { id: 'inventory-svc', label: 'Inventory Service', type: 'service', group: 'backend' },
      { id: 'product-db', label: 'Product DB', type: 'database', group: 'storage' },
      { id: 'cart-cache', label: 'Cart Cache (Redis)', type: 'cache', group: 'storage' },
      { id: 'order-db', label: 'Order DB', type: 'database', group: 'storage' },
      { id: 'inventory-db', label: 'Inventory DB', type: 'database', group: 'storage' },
    ],
    edges: [
      { source: 'browser', target: 'cdn', label: 'Assets', style: 'solid' },
      { source: 'browser', target: 'lb', label: 'HTTP', style: 'solid' },
      { source: 'lb', target: 'api', label: 'Internal', style: 'solid' },
      { source: 'api', target: 'product-svc', label: 'Browse', style: 'solid' },
      { source: 'api', target: 'cart-svc', label: 'Cart', style: 'solid' },
      { source: 'api', target: 'order-svc', label: 'Checkout', style: 'solid' },
      { source: 'product-svc', target: 'product-db', label: 'SQL', style: 'solid' },
      { source: 'cart-svc', target: 'cart-cache', label: 'Redis', style: 'solid' },
      { source: 'order-svc', target: 'order-db', label: 'SQL', style: 'solid' },
      { source: 'order-svc', target: 'inventory-svc', label: 'Decrease', style: 'solid' },
      { source: 'inventory-svc', target: 'inventory-db', label: 'SQL', style: 'solid' },
    ],
  },
  {
    id: 'realtime-chat',
    name: 'Real-time Chat Application',
    difficulty: 'intermediate',
    description: 'A WebSocket-based chat system with message persistence and presence detection.',
    useCase: 'Messaging apps, customer support chat, collaboration tools',
    whenToUse: 'Use when users need real-time, bidirectional communication with message persistence and online presence.',
    considerations: 'WebSocket connections are stateful — use Redis Pub/Sub to broadcast across multiple server instances.',
    nodes: [
      { id: 'client', label: 'Chat Client', type: 'client', group: 'frontend' },
      { id: 'lb', label: 'Load Balancer', type: 'gateway', group: 'infra' },
      { id: 'ws-svc', label: 'WebSocket Service', type: 'service', group: 'backend' },
      { id: 'api-svc', label: 'REST API Service', type: 'service', group: 'backend' },
      { id: 'msg-svc', label: 'Message Service', type: 'service', group: 'backend' },
      { id: 'presence-svc', label: 'Presence Service', type: 'service', group: 'backend' },
      { id: 'redis-pubsub', label: 'Redis Pub/Sub', type: 'queue', group: 'storage' },
      { id: 'msg-db', label: 'Message DB', type: 'database', group: 'storage' },
      { id: 'user-db', label: 'User DB', type: 'database', group: 'storage' },
      { id: 'session-cache', label: 'Session Cache', type: 'cache', group: 'storage' },
    ],
    edges: [
      { source: 'client', target: 'lb', label: 'WS/HTTP', style: 'solid' },
      { source: 'lb', target: 'ws-svc', label: 'WebSocket', style: 'solid' },
      { source: 'lb', target: 'api-svc', label: 'REST', style: 'solid' },
      { source: 'ws-svc', target: 'msg-svc', label: 'Process', style: 'solid' },
      { source: 'ws-svc', target: 'redis-pubsub', label: 'Publish', style: 'dashed' },
      { source: 'redis-pubsub', target: 'ws-svc', label: 'Subscribe', style: 'dashed' },
      { source: 'ws-svc', target: 'presence-svc', label: 'Status', style: 'solid' },
      { source: 'msg-svc', target: 'msg-db', label: 'Store', style: 'solid' },
      { source: 'api-svc', target: 'user-db', label: 'SQL', style: 'solid' },
      { source: 'api-svc', target: 'session-cache', label: 'Redis', style: 'solid' },
    ],
  },
];

const playgroundExercises = [
  {
    id: 'define-component',
    title: 'Define a Component',
    instruction: 'Create a component definition for a "User Authentication Service". Fill in the name, type, and description.',
    template: '{\n  "name": "___",\n  "type": "___",\n  "description": "___"\n}',
    expectedKeywords: ['auth', 'service', 'authentication', 'user'],
    hints: ['The name should describe what it does', 'Type should be one of: microservice, api-gateway, load-balancer, cache, etc.', 'The description should explain its responsibility'],
  },
  {
    id: 'identify-pattern',
    title: 'Identify the Architecture Pattern',
    instruction: 'Which pattern separates read and write operations into different models?',
    options: ['Microservices', 'CQRS', 'Event-Driven', 'Circuit Breaker'],
    correct: 1,
    explanation: 'CQRS (Command Query Responsibility Segregation) separates commands (writes) from queries (reads).',
  },
  {
    id: 'order-components',
    title: 'Order the Request Flow',
    instruction: 'Put these components in the correct order for a typical web request from browser to response.',
    items: ['Database', 'Load Balancer', 'Browser', 'Web Server'],
    correctOrder: ['Browser', 'Load Balancer', 'Web Server', 'Database'],
    hints: ['Start with where the user interacts', 'Think about what distributes traffic', 'The database is the last stop for data'],
  },
  {
    id: 'fill-architecture',
    title: 'Complete the Architecture',
    instruction: 'Fill in the missing component type to complete this e-commerce architecture.',
    template: '{\n  "components": [\n    { "name": "API Gateway", "type": "api-gateway" },\n    { "name": "Product Service", "type": "microservice" },\n    { "name": "Redis", "type": "___" },\n    { "name": "PostgreSQL", "type": "relational-database" }\n  ]\n}',
    expectedKeywords: ['cache', 'key-value'],
    hints: ['Redis is commonly used for...', 'Think about what makes data access faster'],
  },
  {
    id: 'choose-db',
    title: 'Choose the Right Database',
    instruction: 'Which database would you use for storing user session data that needs to be accessed very quickly?',
    options: ['PostgreSQL (relational)', 'Redis (key-value)', 'MongoDB (document)', 'Elasticsearch (search)'],
    correct: 1,
    explanation: 'Redis is ideal for session data because it provides sub-millisecond read/write speeds as a key-value store.',
  },
];

module.exports = { modules, templates, playgroundExercises };
