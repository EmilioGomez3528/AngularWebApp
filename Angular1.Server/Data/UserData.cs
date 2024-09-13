using Angular1.Server.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.SqlClient;


namespace Angular1.Server.Data
{
    public class UserData
    {
        private readonly string conection;

        //CONSTRUCTOR QUE LLAMA A LA CONEXION DE LA BASE DE DATOS
        public UserData(IConfiguration configuration)
        {
            conection = configuration.GetConnectionString("SQLconnection")!;
        }

        //METODOS DE PROCEDIMIENTOS ALMACENADOS

        //PROCEDIMIENTO ALMACENADO PARA LISTAR LOS USUARIOS
        public async Task<List<User>> List()
        {
            List<User> list = new List<User>();
            using (var con = new SqlConnection(conection))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("dbo.GetUserDetails", con);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        list.Add(new User
                        {
                            Id = Convert.ToInt32(reader["Id"])
                        });
                    }
                }
            }
            return list;
        }
    }
}