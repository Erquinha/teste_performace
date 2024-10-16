const { getUserById, connection } = require('./db');

describe('Testes para getUserById', () => {

  

  beforeAll(async () => {
    await connection.query("CREATE TABLE IF NOT EXISTS cadastro (id INT AUTO_INCREMENT PRIMARY KEY, nome_aluno VARCHAR(255), matricula VARCHAR(20), email VARCHAR(255), data_nascimento VARCHAR(20))");
    await connection.query("INSERT INTO cadastro (nome_aluno, matricula, email, data_nascimento) VALUES ('Erica Marques', '75999999999', 'email@email.com', '2000-10-11')");
  });

  afterAll(async () => {

    await connection.end();
  });
   

  

  test('deve retornar o usuário correto pelo id', async () => {

    const inicio = performance.now();
    const user = await getUserById(2);
    const fim = performance.now();

    const duracao = fim - inicio;
    console.log(`Tempo de execução: ${duracao.toFixed(2)} ms`);  
    expect(duracao).toBeLessThanOrEqual(100);

    expect(user).toHaveProperty('nome_aluno', 'Erica Marques');
    expect(user).toHaveProperty('matricula', '75999999999');
    expect(user).toHaveProperty('email', 'email@email.com');
    expect(user).toHaveProperty('data_agendamento', '2000-10-11');

    console.log(`Usuário: `, user);
  });

  test('Verificar se getUserById responde em menos de 50ms', async () => {
    const inicio = performance.now();
    await getUserById(2);
    const fim = performance.now();

    const duracao = fim - inicio;
    console.log(`Tempo de execução: ${duracao.toFixed(2)} ms`);
    expect(duracao).toBeLessThanOrEqual(50);
  });


  test('Atualização do cadastro', async () => {
    

    const [result] = await connection.execute(
      'UPDATE agendamento SET nome_aluno = ? WHERE id = ?',
      ['Erica Marques', 2] 
    );

    expect(result.affectedRows).toBe(1);

    const updateUser = await getUserById(2);
    expect(updateUser).toHaveProperty('nome_aluno', 'Erica Marques');
  });


  test('verifica se parte do nome está presente', async () => {
    const cadastro = await getUserById(2);
    expect(cadastro.nome_aluno).toMatch(/Eri/);
  });
});


