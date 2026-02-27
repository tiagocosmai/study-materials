# ORMs: C#, Node.js, Clojure, Python e Java

**ORM** (Object-Relational Mapping) mapeia entidades de aplicação para tabelas e consultas SQL, reduzindo SQL manual e padronizando acesso a bancos relacionais. Em ecossistemas NoSQL, bibliotecas equivalentes (ODM ou drivers de alto nível) oferecem abstração sem ser “relacional”. Este capítulo traz exemplos com os ORMs/ODMs mais usados em **C#**, **Node.js**, **Clojure**, **Python** e **Java**, para bancos **relacionais** (SQL Server, MySQL, PostgreSQL, Oracle, Supabase) e **não relacionais** (MongoDB, DynamoDB, Redis) onde aplicável.

---

## Visão geral por linguagem

| Linguagem | Relacional (principais)      | Não relacional (principais)     |
|-----------|------------------------------|----------------------------------|
| C#        | Entity Framework Core        | MongoDB.Driver, DynamoDB (AWS SDK) |
| Node.js   | Prisma, TypeORM, Sequelize   | Mongoose (MongoDB)              |
| Clojure   | next.jdbc, HoneySQL          | Monger (MongoDB), carmine (Redis) |
| Python    | SQLAlchemy, Django ORM       | PyMongo, motor (MongoDB)        |
| Java      | Hibernate/JPA                | Spring Data MongoDB, Jedis (Redis) |

---

## C#

### Entity Framework Core (relacional)

EF Core é o ORM padrão no ecossistema .NET. Suporta SQL Server, MySQL, PostgreSQL, SQLite, Oracle.

**Modelo e DbContext:**

```csharp
public class Usuario
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string Nome { get; set; }
    public bool Ativo { get; set; } = true;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public ICollection<Pedido> Pedidos { get; set; }
}

public class Pedido
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; }
    public decimal Total { get; set; }
    public DateTime DataPedido { get; set; }
}

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>().HasIndex(u => u.Email).IsUnique();
    }
}
```

**Uso (ASP.NET Core com PostgreSQL):**

```csharp
// Startup/Program: AddDbContext com Npgsql
// services.AddDbContext<AppDbContext>(o => o.UseNpgsql(connectionString));

using (var ctx = app.Services.GetRequiredService<AppDbContext>())
{
    var user = await ctx.Usuarios.FirstOrDefaultAsync(u => u.Email == "maria@example.com");
    var pedidos = await ctx.Pedidos
        .Where(p => p.UsuarioId == user.Id)
        .OrderByDescending(p => p.DataPedido)
        .Take(10)
        .ToListAsync();
}
```

### MongoDB em C#

Para MongoDB usa-se o driver oficial (**MongoDB.Driver**), sem ORM clássico; a API é fluente e tipada.

```csharp
var client = new MongoClient(connectionString);
var db = client.GetDatabase("app");
var col = db.GetCollection<Usuario>("usuarios");
var user = await col.Find(u => u.Email == "maria@example.com").FirstOrDefaultAsync();
await col.InsertOneAsync(new Usuario { Nome = "João", Email = "joao@example.com" });
```

---

## Node.js

### Prisma (relacional)

Prisma usa um **schema** declarativo e gera cliente TypeScript/JavaScript. Suporta PostgreSQL, MySQL, SQLite, SQL Server.

**schema.prisma:**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
generator client {
  provider = "prisma-client-js"
}
model Usuario {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  nome      String?
  ativo     Boolean  @default(true)
  criadoEm  DateTime @default(now())
  pedidos   Pedido[]
}
model Pedido {
  id         Int      @id @default(autoincrement())
  usuarioId  Int
  usuario    Usuario  @relation(fields: [usuarioId], references: [id])
  total      Decimal  @db.Decimal(12, 2)
  dataPedido DateTime @default(now())
}
```

**Uso:**

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const user = await prisma.usuario.findUnique({ where: { email: 'maria@example.com' } });
const pedidos = await prisma.pedido.findMany({
  where: { usuarioId: user.id },
  orderBy: { dataPedido: 'desc' },
  take: 10,
  include: { usuario: { select: { nome: true } } }
});
await prisma.usuario.create({ data: { email: 'joao@example.com', nome: 'João' } });
```

### TypeORM / Sequelize

- **TypeORM:** decorators em entidades, suporte a TypeScript e vários bancos; integra bem com NestJS.
- **Sequelize:** um dos mais antigos no ecossistema Node; suporta PostgreSQL, MySQL, SQLite, MSSQL.

### Mongoose (MongoDB – Node.js)

Mongoose é o ODM mais usado para MongoDB em Node: schemas, validação, middlewares.

```javascript
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nome: String,
  ativo: { type: Boolean, default: true },
  criadoEm: { type: Date, default: Date.now }
});
const Usuario = mongoose.model('Usuario', schema);

await Usuario.create({ email: 'maria@example.com', nome: 'Maria' });
const user = await Usuario.findOne({ email: 'maria@example.com' });
```

---

## Clojure

Clojure não adota um ORM “clássico”; o padrão é **next.jdbc** (ou clojure.java.jdbc) para SQL e **HoneySQL** para construção de queries. Para MongoDB: **Monger**; para Redis: **carmine**.

### next.jdbc + HoneySQL (relacional)

```clojure
(require '[next.jdbc :as jdbc]
         '[honey.sql :as sql]
         '[honey.sql.helpers :as h])

(def ds (jdbc/get-datasource {:jdbcUrl "jdbc:postgresql://localhost/app_db?user=app&password=..."}))

;; Inserir
(jdbc/execute! ds (sql/format (h/insert-into :usuarios
  (h/values [{:email "maria@example.com" :nome "Maria"}]))))

;; Consultar
(def q (sql/format (-> (h/select :id :email :nome)
                      (h/from :usuarios)
                      (h/where [:= :email "maria@example.com"])
                      (h/limit 1))))
(jdbc/execute! ds q)
```

### Monger (MongoDB)

```clojure
(require '[monger.core :as mg]
         '[monger.collection :as mc])

(def conn (mg/connect-via-uri "mongodb://localhost:27017/app"))
(def db (:db conn))

(mc/insert db "usuarios" {:email "maria@example.com" :nome "Maria"})
(mc/find-one db "usuarios" {:email "maria@example.com"})
```

---

## Python

### SQLAlchemy (relacional)

SQLAlchemy é o ORM mais usado em Python (Flask, FastAPI, etc.). Suporta PostgreSQL, MySQL, Oracle, SQLite.

```python
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, func
from sqlalchemy.orm import declarative_base, relationship, Session

Base = declarative_base()

class Usuario(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    nome = Column(String(200))
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, server_default=func.now())
    pedidos = relationship("Pedido", back_populates="usuario")

class Pedido(Base):
    __tablename__ = 'pedidos'
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'), nullable=False)
    total = Column(Numeric(12, 2), default=0)
    usuario = relationship("Usuario", back_populates="pedidos")

engine = create_engine('postgresql://app:senha@localhost/app_db')
with Session(engine) as session:
    user = session.query(Usuario).filter(Usuario.email == 'maria@example.com').first()
    pedidos = session.query(Pedido).filter(Pedido.usuario_id == user.id).order_by(Pedido.id.desc()).limit(10).all()
```

### Django ORM

Django traz ORM integrado; modelos são classes que herdam de `models.Model`. Suporta PostgreSQL, MySQL, SQLite, Oracle.

```python
from django.db import models

class Usuario(models.Model):
    email = models.EmailField(unique=True)
    nome = models.CharField(max_length=200, blank=True)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)

class Pedido(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    data_pedido = models.DateTimeField(auto_now_add=True)

# Uso
user = Usuario.objects.get(email='maria@example.com')
pedidos = Pedido.objects.filter(usuario=user).order_by('-data_pedido')[:10]
```

### PyMongo (MongoDB)

Driver oficial; sem ORM; API direta com dicionários.

```python
from pymongo import MongoClient
db = MongoClient('mongodb://localhost:27017')['app']
db.usuarios.insert_one({'email': 'maria@example.com', 'nome': 'Maria'})
user = db.usuarios.find_one({'email': 'maria@example.com'})
```

---

## Java

### Hibernate / JPA (relacional)

JPA (Jakarta Persistence) é o padrão; **Hibernate** é a implementação mais usada. Funciona com PostgreSQL, MySQL, Oracle, etc.

```java
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String email;
    private String nome;
    private Boolean ativo = true;
    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
    @OneToMany(mappedBy = "usuario")
    private List<Pedido> pedidos;
    // getters/setters
}

@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    private BigDecimal total;
    private LocalDateTime dataPedido;
    // getters/setters
}

// Uso (Spring Data JPA)
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}
List<Pedido> pedidos = pedidoRepository.findByUsuarioOrderByDataPedidoDesc(user, PageRequest.of(0, 10));
```

### Spring Data MongoDB / Redis

- **Spring Data MongoDB:** repositórios e entidades com anotações (`@Document`, `@Id`); suporta MongoDB.
- **Spring Data Redis:** integração com Redis (templates, repositórios); para cache e filas usa-se também **Lettuce** ou **Jedis**.

---

## Supabase (Node.js / cliente)

Supabase expõe Postgres via REST e Realtime; o “ORM” é o cliente JavaScript que abstrai as chamadas à API.

```javascript
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const { data: user } = await supabase.from('usuarios').select('*').eq('email', 'maria@example.com').single();
const { data: pedidos } = await supabase.from('pedidos').select('*, usuarios(nome)').eq('usuario_id', user.id).order('data_pedido', { ascending: false }).limit(10);
```

---

## Diagrama: ORM na arquitetura

```mermaid
flowchart LR
  App[Aplicação]
  ORM[ORM/ODM]
  DB[(Banco)]
  App --> ORM
  ORM --> DB
```

---

## Resumo

- **Relacional:** EF Core (C#), Prisma/TypeORM/Sequelize (Node), next.jdbc+HoneySQL (Clojure), SQLAlchemy/Django ORM (Python), Hibernate/JPA (Java).
- **MongoDB:** MongoDB.Driver (C#), Mongoose (Node), Monger (Clojure), PyMongo (Python), Spring Data MongoDB (Java).
- **Redis/DynamoDB:** geralmente via SDKs ou bibliotecas específicas (carmine, AWS SDK, Jedis, etc.), não como ORM relacional.

Escolha o ORM conforme stack, necessidade de migrações, suporte a múltiplos bancos e preferência por código declarativo (Prisma, EF Core) ou programático (SQLAlchemy, HoneySQL).

---

*Próximo: [Transações e consistência](./11-transacoes-consistencia.md).*
