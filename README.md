# Primeiro Desafio da Turma ENIAC I - Alpha EdTech
## Descrição
Desenvolver uma versão web do jogo Simon, lançado no Brasil como Genius. 

Link explicativo do jogo: https://pt.wikipedia.org/wiki/Genius_(jogo) 
## Requisitos do desafio
* A codificação deve ser feita por você. Pode-se utilizar referências obtidas pela
internet de códigos, porém as classes, métodos e controle de eventos devem ser
exercitadas ao máximo para o perfeito entendimento da programação;

* A interface tem q ser bem elaborada e intuitiva. Assim, o pressionar de uma cor deve
ser seguida de som e luz respectiva; o som deve ser agradável (pode-se utilizar outros
sons além dos referenciados nesta atividade); o ‘Score’ deve ser de fácil
acompanhamento; indicar a derrota com o som e luzes respectivas; entre outros
detalhes para a melhor experiência do usuário;

* Deve utilizar a classe ‘Timer’ criada anteriormente para o controle do intervalo da luz
e som que demonstra a sequência a ser repetida. Notar que quanto maior a
sequência, menor o intervalo entre o piscar das luzes e sons;

* Deve utilizar a classe ‘Simon’ que contém os atributos necessários para controle e
armazenamento de sequência randomicamente gerada e métodos para sua página
possa acessar e o usuário possa jogar;

* Deve possibilitar o cadastro e o uso de teclas de atalho para o usuário possa jogar
também pelo teclado (além do mouse);

* Deve poder definir o tempo de resposta máxima (timeout) que, se atingido, será
disparado o ‘callback’ de fim de jogo;

* Deve possibilitar ao usuário clicar em um botão ‘Replay’ para mostrar qual a última
sequência no qual houve a ‘derrota’ do usuário para que ele saiba onde errou.
## Pontos de melhoria no código
1. Orientação a Objetos.
2. Refatorações.
## Implementações futuras de interface e jogabilidade
1. Modo acessibilidade para pessoas daltônicas (com paleta de cores adequada e possibilidade de personalização das cores) e cegas (ao invés de piscar as luzes, reproduzir áudio com os nomes das cores).
2. Melhor detalhamento e exibição do menu de ajuda.
3. Exibição de ranking (persistente) de pontuações e tempo, exibindo nome de usuário.
