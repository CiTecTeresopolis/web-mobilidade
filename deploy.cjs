const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();

const config = {
    user: "teresopolis",
    password: "sempreassims2", // ⬅️ Coloque sua senha aqui
    host: "ftp.nodejsng2f01.uni5.net",
    port: 21,
    localRoot: __dirname + "/dist",    // Se o build gerar a pasta 'build', mude para '/build'
    remoteRoot: "/www/",               // ⬅️ Já configurado para a pasta certa que descobrimos!
    include: ["*", "**/*"],
    deleteRemote: false, 
    forcePasv: true                    // Força o modo passivo para ignorar a trava da rede
};

ftpDeploy
    .deploy(config)
    .then((res) => console.log("🚀 Deploy concluído com sucesso no servidor!"))
    .catch((err) => console.log("Erro no deploy: ", err));