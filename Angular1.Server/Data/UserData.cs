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
        /*
        public async Task<List<User>> List()
        {
            List<User> list = new List<User>();
            using (var con = new SqlConnection(conection))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("dbo.GetUserDetails", con);
                //cmd.Parameters.AddWithValue("@UserId", Id);
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
        */
        
        //DECLARACION DE PARAMETROS PARA EL STOREDPROCEDURE
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

                    
                    SqlCommand userDetailsCmd = new SqlCommand("SELECT U.Username, M.Password FROM Users U JOIN Membership M ON U.Id = M.UserId WHERE U.Id = @UserId", con);
                    userDetailsCmd.Parameters.AddWithValue("@UserId", userId);

                    using (var reader = await userDetailsCmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            user = new User
                            {
                                UserId = userId,
                                Username = reader["Username"] != DBNull.Value ? reader["Username"].ToString() : string.Empty,
                                Password = reader["Password"] != DBNull.Value ? reader["Password"].ToString() : string.Empty

                            };
                        }
                }   }
            }
            return user;
        }
    }
}