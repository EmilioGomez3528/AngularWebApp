using Angular1.Server.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
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

        //METODO 1 DE PROCEDIMIENTOS ALMACENADOS
        
        //DECLARACION DE PARAMETROS PARA EL STOREDPROCEDURE DE LOGIN
        public async Task<User?> Get(string username, string password)
        {
            User? user = null;

            using (var con = new SqlConnection(conection))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("dbo.ValidateUsers", con);
                //PARAMETROS DE ENTRADA DEL STORED
                cmd.Parameters.AddWithValue("@Username", username);
                cmd.Parameters.AddWithValue("@Password", password);

                // PARÁMETRO DE SALIDA
                SqlParameter UserIdParam = new SqlParameter("@UserId", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(UserIdParam);

                //DECLARACION DEL TIPO STOREDPROCEDURE
                cmd.CommandType= CommandType.StoredProcedure;

                // Ejecuta el procedimiento almacenado
                await cmd.ExecuteNonQueryAsync();


                if (UserIdParam.Value != DBNull.Value) { 
                    
                    int userId = (int)UserIdParam.Value;

                    if (userId == 0) {
                        return null;
                    }
                    
                    SqlCommand userDetailsCmd = new SqlCommand("dbo.GetDetails", con);
                    userDetailsCmd.Parameters.AddWithValue("@UserId", userId);
                    userDetailsCmd.CommandType = CommandType.StoredProcedure;


                    using (var reader = await userDetailsCmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            user = new User
                            {
                                UserId = userId,
                                Username = username,
                                Password = password,
                                FirstName = reader["FirstName"] != DBNull.Value ? reader["FirstName"].ToString() : string.Empty,
                                LastName = reader["LastName"] != DBNull.Value ? reader["lastName"].ToString() : string.Empty,
                                Email = reader["Email"] != DBNull.Value ? reader["Email"].ToString() : string.Empty
                            };
                        }
                }   }
            }
            
            return user;
        }


        //METODO 2 DE PROCEDIMIENTOS ALMACENADOS

        //DECLARACION DE PARAMETROS PARA EL STOREDPROCEDURE DE DETALLES
        public async Task<List<User>> GetDetails()
        {
            var detailsList = new List<User>();

            //Conexión SQL
            using (var con = new SqlConnection(conection))
            {
                // Abrir la conexión
                await con.OpenAsync();

                //Comando SQL para ejecutar el stored procedure
                using (SqlCommand command = new SqlCommand("dbo.GetUsers", con))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Ejecutar el comando
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        // Leer los datos devueltos por el stored procedure
                        while (await reader.ReadAsync())
                        {
                            
                            var detail = new User
                            {
                                UserId = reader.GetInt32(0),
                                FirstName = reader.GetString(1),
                                LastName = reader.GetString(2),
                                Email = reader.GetString(3),
                            };

                            // Agregar el detalle a la lista
                            detailsList.Add(detail);
                        }
                    }
                }
            }
            return detailsList;
        }
    }
}