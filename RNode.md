## Java 11

```sh
sudo apt install default-jdk

sudo update-alternatives --config java
```

## Nix

Install Nix
https://nixos.org/nix/

```sh
curl https://nixos.org/nix/install | sh
```

## Haskell

Install Haskell - `ghc`, `cabal`, `stack`

Install Scala - `sbt`

```sh
nix-env -i ghc cabal-install stack sbt
```

## BNFC

```sh
nix-env -i jflex

# Možda zatreba (Ubuntu)
sudo apt-get install libgmp3-dev
```

## RNode build

```sh
# Clean project
sbt clean

# Samo prvi put ili kad se promijeni BNFC file
sbt bnfc:clean bnfc:generate

# Build
# path: rchain/node/target/universal/stage/bin/rnode
sbt -Dsbt.log.noformat=true compile node/universal:stage
```
