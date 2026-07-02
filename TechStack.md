# DevMentor — Technology Stack

## 1. Backend

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Language — LTS, modern features |
| Spring Boot | 3.x (via 4.0.5 starter parent) | Application framework — auto-config, embedded server |
| Spring Boot Starter Web | 3.x | REST API development (Tomcat embedded) |
| Spring Boot Starter Data JPA | 3.x | ORM and database access |
| Spring Boot Starter Security | 3.x | Authentication and authorization |
| Gradle | 8.x | Build tool — dependency management, task automation |

### Security
| Library | Version | Purpose |
|---------|---------|---------|
| JJWT (io.jsonwebtoken) | 0.11.5 | JWT token creation and validation |
| spring-boot-starter-security | 3.x | Spring Security integration |
| BCrypt (via Spring Security) | — | Password hashing |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| MySQL 8 (via mysql-connector-j) | 8.x | Production database |
| H2 Database | 2.x | Local development / testing |
| HikariCP | 5.x (Spring Boot default) | Connection pooling |
| Spring Data JPA / Hibernate | 6.x | ORM — entity mapping, query generation |

### Additional Dependencies
| Library | Version | Purpose |
|---------|---------|---------|
| Lombok | 1.18.x | Boilerplate reduction (constructors, getters/setters) |
| commons-codec | 1.15 | Encoding utilities (currently unused) |
| spring-boot-starter-test | 3.x | Testing framework (JUnit 5, Mockito) |
| spring-security-test | 3.x | Security testing utilities |

### Configuration Management
- Multi-profile setup: `application.properties` (default), `application-prod.properties`, `application-local.properties`
- Environment variable injection for secrets
- `.env.example` for local development

### Deployment Config
- Docker multi-stage build (JDK 17 → JRE 17)
- `procfile` for Render deployment
- `render.yaml` for Render infrastructure-as-code

---

## 2. Frontend

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.2.4 | UI library — component-based architecture |
| React DOM | ^19.2.4 | DOM rendering |
| Create React App (react-scripts) | 5.0.1 | Build tooling (Webpack, Babel, dev server) |

### Routing & Navigation
| Library | Version | Purpose |
|---------|---------|---------|
| react-router-dom | ^7.13.2 | Client-side routing, navigation hooks |

### HTTP Client
| Library | Version | Purpose |
|---------|---------|---------|
| Axios | ^1.14.0 | HTTP client — interceptors, request/response transformation |

### UI & Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | ^3.4.1 | Utility-first CSS framework |
| PostCSS | ^8.5.8 | CSS transformation pipeline |
| Autoprefixer | ^10.4.27 | CSS vendor prefixing |
| Google Fonts (Inter) | — | Primary font family (via CDN in index.html) |

### Third-Party Integrations
| Library | Version | Purpose |
|---------|---------|---------|
| agora-rtc-sdk-ng | ^4.24.3 | Agora Web SDK — video/audio calling |
| Razorpay Checkout | (CDN) | Payment gateway — checkout modal |

### Testing
| Library | Version | Purpose |
|---------|---------|---------|
| @testing-library/react | ^16.x | Component testing |
| @testing-library/jest-dom | ^6.x | DOM-specific matchers |
| @testing-library/user-event | ^14.x | User interaction simulation |
| web-vitals | ^2.1.4 | Performance metrics |

### Build & Deployment
| Technology | Purpose |
|------------|---------|
| Docker + Nginx | Production containerization |
| Vercel | Static deployment (alternative) |
| Netlify | Static deployment (alternative) |
| nginx.conf | Gzip, caching, security headers, SPA fallback |
| vercel.json | Vercel SPA rewrite rules |
| netlify.toml | Netlify build + redirect config |

---

## 3. Infrastructure & DevOps

### Containerization
| Technology | Purpose |
|------------|---------|
| Docker | Multi-stage builds for both backend and frontend |
| Docker Compose | Local development orchestration (MySQL + Backend + Frontend) |

### Deployment
| Platform | Service | Purpose |
|----------|---------|---------|
| Render | Backend (Docker) | Spring Boot API hosting |
| Vercel / Render | Frontend (Static) | React SPA hosting |
| Aiven / Render MySQL | Database | Managed MySQL 8 |

### Version Control
| Technology | Purpose |
|------------|---------|
| Git + GitHub | Source control, CI trigger |
| GitHub (nk1710/DevMentor) | Remote repository |

---

## 4. Architecture Decisions

### Why Spring Boot + MySQL?
- **Spring Boot:** Industry standard for Java REST APIs, excellent JPA/Hibernate integration, mature security framework
- **MySQL:** Widely available, good for structured relational data with complex joins (mentor/booking/slot relationships)

### Why React (CRA)?
- **CRA:** Zero-config setup, good for rapid prototyping
- **React 19:** Latest stable with improved concurrent features
- **Plain JS (no TypeScript):** Faster development velocity for MVP stage

### Why Tailwind CSS?
- Rapid UI development without custom CSS files
- Consistent design system via utility classes
- Small production bundle (purged unused styles)

### Why Agora?
- Reliable WebRTC infrastructure
- SDK handles cross-browser compatibility
- Simple channel-based room model

### Why Razorpay?
- Dominant Indian payment gateway
- Simple client-side integration
- Supports UPI, cards, netbanking, wallets

---

## 5. Current Technical Gaps

| Gap | Impact | Priority |
|-----|--------|----------|
| No TypeScript | Runtime type errors, poor DX | Medium |
| No state management library | Prop drilling, repeated fetch logic | Medium |
| No form validation library | Verbose manual validation | Low |
| No testing infrastructure | Low confidence in changes | High |
| No caching | Performance degradation at scale | Medium |
| No monitoring/observability | Blind to production issues | High |
| No CI/CD pipeline | Manual build/deploy process | Medium |
