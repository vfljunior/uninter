document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre seções
    const navLinks = document.querySelectorAll('.sidebar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            
            // Atualizar navegação ativa
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar seção correspondente
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
        });
    });
    
    // Simulação de banco de dados para funcionários
    if (!localStorage.getItem('funcionarios')) {
        const funcionariosIniciais = [
            { id: 1, nome: "João Silva", email: "joao@empresa.com", cargo: "Desenvolvedor", departamento: "TI" },
            { id: 2, nome: "Maria Souza", email: "maria@empresa.com", cargo: "RH", departamento: "Recursos Humanos" }
        ];
        localStorage.setItem('funcionarios', JSON.stringify(funcionariosIniciais));
    }
    
    // Simulação de banco de dados para registros de ponto
    if (!localStorage.getItem('registrosPonto')) {
        const registrosIniciais = [
            { 
                id: 1, 
                funcionarioId: 1, 
                data: "2023-10-01", 
                entrada: "08:00", 
                almoco: "12:00", 
                retorno: "13:00", 
                saida: "17:00", 
                horasExtras: "00:00" 
            }
        ];
        localStorage.setItem('registrosPonto', JSON.stringify(registrosIniciais));
    }
    
    // Carregar lista de funcionários
    if (document.getElementById('tabela-funcionarios')) {
        carregarFuncionarios();
    }
    
    // Modal para novo funcionário
    const modal = document.getElementById('modal-funcionario');
    const btnNovoFuncionario = document.getElementById('novo-funcionario');
    const span = document.getElementsByClassName('close')[0];
    
    if (btnNovoFuncionario) {
        btnNovoFuncionario.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }
    
    if (span) {
        span.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    // Formulário de funcionário
    const formFuncionario = document.getElementById('form-funcionario');
    if (formFuncionario) {
        formFuncionario.addEventListener('submit', function(e) {
            e.preventDefault();
            adicionarFuncionario();
        });
    }
    
    // Botões de registro de ponto
    const btnEntrada = document.getElementById('entrada');
    const btnAlmoco = document.getElementById('almoco');
    const btnRetorno = document.getElementById('retorno');
    const btnSaida = document.getElementById('saida');
    
    if (btnEntrada) btnEntrada.addEventListener('click', () => registrarPonto('entrada'));
    if (btnAlmoco) btnAlmoco.addEventListener('click', () => registrarPonto('almoco'));
    if (btnRetorno) btnRetorno.addEventListener('click', () => registrarPonto('retorno'));
    if (btnSaida) btnSaida.addEventListener('click', () => registrarPonto('saida'));
});

function carregarFuncionarios() {
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
    const tabela = document.getElementById('tabela-funcionarios').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    
    funcionarios.forEach(func => {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = func.nome;
        row.insertCell(1).textContent = func.email;
        row.insertCell(2).textContent = func.cargo;
        row.insertCell(3).textContent = func.departamento;
        
        const cellAcoes = row.insertCell(4);
        cellAcoes.innerHTML = `
            <button class="editar" data-id="${func.id}">Editar</button>
            <button class="excluir" data-id="${func.id}">Excluir</button>
        `;
    });
    
    // Adicionar eventos para botões de editar/excluir
    document.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', function() {
            editarFuncionario(this.getAttribute('data-id'));
        });
    });
    
    document.querySelectorAll('.excluir').forEach(btn => {
        btn.addEventListener('click', function() {
            excluirFuncionario(this.getAttribute('data-id'));
        });
    });
}

function adicionarFuncionario() {
    const nome = document.getElementById('func-nome').value;
    const email = document.getElementById('func-email').value;
    const cargo = document.getElementById('func-cargo').value;
    const departamento = document.getElementById('func-departamento').value;
    
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
    const novoId = funcionarios.length > 0 ? Math.max(...funcionarios.map(f => f.id)) + 1 : 1;
    
    funcionarios.push({
        id: novoId,
        nome,
        email,
        cargo,
        departamento
    });
    
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    document.getElementById('modal-funcionario').style.display = 'none';
    document.getElementById('form-funcionario').reset();
    carregarFuncionarios();
}

function editarFuncionario(id) {
    // Implementar lógica de edição
    alert(`Editar funcionário ID: ${id}`);
}

function excluirFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        let funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
        funcionarios = funcionarios.filter(f => f.id != id);
        localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
        carregarFuncionarios();
    }
}

function registrarPonto(tipo) {
    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    const horario = `${hora}:${minutos}`;
    const data = agora.toISOString().split('T')[0];
    
    const registros = JSON.parse(localStorage.getItem('registrosPonto')) || [];
    const registroHoje = registros.find(r => r.data === data) || { 
        id: registros.length + 1, 
        funcionarioId: 1, // Simulação - usar ID do usuário logado
        data 
    };
    
    registroHoje[tipo] = horario;
    
    // Calcular horas trabalhadas e extras se todos os registros estiverem completos
    if (registroHoje.entrada && registroHoje.almoco && registroHoje.retorno && registroHoje.saida) {
        const entrada = new Date(`${data}T${registroHoje.entrada}:00`);
        const almoco = new Date(`${data}T${registroHoje.almoco}:00`);
        const retorno = new Date(`${data}T${registroHoje.retorno}:00`);
        const saida = new Date(`${data}T${registroHoje.saida}:00`);
        
        const manha = (almoco - entrada) / (1000 * 60 * 60); // horas
        const tarde = (saida - retorno) / (1000 * 60 * 60); // horas
        const totalHoras = manha + tarde;
        
        // Considerando jornada de 8 horas
        const horasExtras = Math.max(0, totalHoras - 8);
        
        registroHoje.totalHoras = `${Math.floor(totalHoras)}:${Math.floor((totalHoras % 1) * 60)}`;
        registroHoje.horasExtras = `${Math.floor(horasExtras)}:${Math.floor((horasExtras % 1) * 60)}`;
        
        // Atualizar status na interface
        document.getElementById('horas-hoje').textContent = registroHoje.totalHoras;
    }
    
    // Atualizar ou adicionar o registro
    const index = registros.findIndex(r => r.data === data);
    if (index >= 0) {
        registros[index] = registroHoje;
    } else {
        registros.push(registroHoje);
    }
    
    localStorage.setItem('registrosPonto', JSON.stringify(registros));
    
    // Atualizar status na interface
    document.getElementById('status-atual').textContent = `Último registro: ${tipo} às ${horario}`;
    alert(`Registro de ${tipo} realizado às ${horario}`);
}