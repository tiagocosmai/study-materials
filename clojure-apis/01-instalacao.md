# Instalação – Clojure no WSL/Ubuntu e macOS

Passo a passo para ter o ambiente Clojure pronto (JDK + Clojure CLI).

---

## Pré-requisito: Java (JDK)

Clojure roda na JVM. Você precisa de um JDK (recomendado: 11 ou 17 LTS).

### WSL / Ubuntu (Debian)

```bash
# Atualizar índice de pacotes
sudo apt update

# Instalar OpenJDK 17
sudo apt install -y openjdk-17-jdk

# Verificar
java -version
javac -version
```

### macOS (Homebrew)

```bash
# Instalar OpenJDK 17
brew install openjdk@17

# Opcional: link para uso padrão
sudo ln -sfn $(brew --prefix)/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

Verificar:

```bash
java -version
```

---

## Instalar o Clojure CLI (ferramenta oficial)

O [Clojure CLI](https://clojure.org/guides/install_clojure) é a forma recomendada para rodar projetos e REPL.

### WSL / Ubuntu

```bash
# Baixar script de instalação
curl -O https://download.clojure.org/install/linux-install-1.11.1.1347.sh
chmod +x linux-install-1.11.1.1347.sh
sudo ./linux-install-1.11.1.1347.sh

# Verificar (pode ser necessário abrir um novo terminal)
clj --version
```

Se preferir instalar via **apt** (quando disponível no seu Ubuntu):

```bash
sudo apt install clojure
clj --version
```

### macOS

```bash
# Via Homebrew
brew install clojure/tools/clojure

# Verificar
clj --version
```

---

## Instalar Leiningen (opcional)

[Leiningen](https://leiningen.org/) é outra ferramenta muito usada para projetos Clojure (build, dependências, REPL).

### WSL / Ubuntu e macOS

```bash
# Baixar script
curl -O https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
chmod +x lein
sudo mv lein /usr/local/bin/

# Primeira execução baixa dependências
lein version
```

---

## Verificação rápida

```bash
# REPL com Clojure CLI
clj

# No REPL:
(+ 1 2)
(println "Olá, Clojure!")
# Sair: Ctrl+D ou (exit)
```

---

## Resumo dos comandos por sistema

| Ação              | WSL/Ubuntu                    | macOS                    |
|-------------------|-------------------------------|--------------------------|
| JDK               | `sudo apt install openjdk-17-jdk` | `brew install openjdk@17` |
| Clojure CLI       | Script linux-install ou `apt install clojure` | `brew install clojure/tools/clojure` |
| Leiningen (opcional) | `lein` em `/usr/local/bin`   | Idem                     |

---

## Referências

- [Clojure – Install guide](https://clojure.org/guides/install_clojure)
- [Leiningen – Install](https://leiningen.org/#install)
- [OpenJDK](https://openjdk.org/)
