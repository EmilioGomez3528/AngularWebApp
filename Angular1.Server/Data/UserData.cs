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
        public async Task<User?> Get(string username)//, string password)
        {
            User? user = null;

            using (var con = new SqlConnection(conection))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("gkan.Emilio_ValidateUsers", con);
                //PARAMETROS DE ENTRADA DEL STORED
                cmd.Parameters.AddWithValue("@Username", username);
                //cmd.Parameters.AddWithValue("@Password", password);

                // PARÁMETRO DE SALIDA
                SqlParameter UserIdParam = new SqlParameter("@UserId", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(UserIdParam);

                //DECLARACION DEL TIPO STOREDPROCEDURE
                cmd.CommandType = CommandType.StoredProcedure;

                // Ejecuta el procedimiento almacenado
                await cmd.ExecuteNonQueryAsync();

                if (UserIdParam.Value != DBNull.Value) {

                    int userId = (int)UserIdParam.Value;

                    if (userId == 0) {
                        return null;
                    }

                    SqlCommand userDetailsCmd = new SqlCommand("gkan.Emilio_GetDetails", con);
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
                                //Password = password,
                                FirstName = reader["FirstName"] != DBNull.Value ? reader["FirstName"].ToString() : string.Empty,
                                LastName = reader["LastName"] != DBNull.Value ? reader["lastName"].ToString() : string.Empty,
                                Email = reader["Email"] != DBNull.Value ? reader["Email"].ToString() : string.Empty
                            };
                        }
                    }
                }
            }
            return user;
        }
        //METODO 2 DE PROCEDIMIENTOS ALMACENADOS

        //METODO DE OBTENCION PARA EL STOREDPROCEDURE DE DETALLES
        public async Task<List<User>> GetDetails()
        {
            var detailsList = new List<User>();

            //Conexión SQL
            using (var con = new SqlConnection(conection))
            {
                // Abrir la conexión
                await con.OpenAsync();


                //Comando SQL para ejecutar el stored procedure
                using (SqlCommand command = new SqlCommand("gkan.Emilio_GetUsers", con))
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
                                FirstName = reader.IsDBNull(1) ? null : reader.GetString(1),
                                LastName = reader.IsDBNull(2) ? null : reader.GetString(2),
                                Email = reader.IsDBNull(3) ? null : reader.GetString(3),
                                CreatedDate = reader.IsDBNull(4) ? (DateTime?)null : reader.GetDateTime(4)
                            };
                            // Agregar el detalle a la lista
                            detailsList.Add(detail);
                        }
                    }
                }
            }
            return detailsList;
        }
        //METODO 3 DE PROCEDIMIENTOS ALMACENADOS

        //METODO DE OBTENCION PARA EL STOREDPROCEDURE DE ROLES Y ORGANIZACIONES DE USUARIOS

        public async Task<List<User>> GetRODetails(string userId)
        {
            var ROList = new List<User>();
            //conexion a base de datos
            using (var con = new SqlConnection(conection))
            {
                //Abrir conexion a base de datos
                await con.OpenAsync();

                using (SqlCommand ROcmd = new SqlCommand("gkan.Emilio_GetRODetails", con))
                {
                    //Parametro UserID
                    ROcmd.Parameters.AddWithValue("@UserId", int.Parse(userId));
                    //Declaracion de tipo stored procedure
                    ROcmd.CommandType = CommandType.StoredProcedure;


                    using (SqlDataReader reader = await ROcmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var ROdetails = new User
                            {
                                OrganizationName = reader["OrganizationName"] != DBNull.Value ? reader["OrganizationName"].ToString() : string.Empty,
                                Roles = reader["Roles"] != DBNull.Value ? reader["Roles"].ToString() : string.Empty
                            };
                            ROList.Add(ROdetails);
                        }
                    }
                }
            }
            return ROList;
        }
        //METODO 4 DE PROCEDIMIENTOS ALMACENADOS

        //METODO DE OBTENCION DE USUARIOS POR ORGANIZACION

        public async Task<List<User>> GetUsersByOrganization(string organizationId) {
            var UsersByOrg = new List<User>();

            using (var con = new SqlConnection (conection))
            {
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("gkan.Emilio_GetUsersByOrganization", con))
                {
                    cmd.Parameters.AddWithValue("@OrganizationId", int.Parse(organizationId));
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (SqlDataReader reader =await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var Users = new User
                            {
                                UserId = reader.GetInt32(0),
                                FirstName = reader.IsDBNull(1) ? null : reader.GetString(1),
                                LastName = reader.IsDBNull(2) ? null : reader.GetString(2),
                                Email = reader.IsDBNull(3) ? null : reader.GetString(3),
                                CreatedDate = reader.IsDBNull(4) ? (DateTime?)null : reader.GetDateTime(4)
                            };
                            UsersByOrg.Add(Users);
                        }
                    }
                }  
            }
            return UsersByOrg;
        }

        //METODO 5 DE PROCEDIMIENTOS ALMACENADOS

        //METODO DE OBTENCION DE LISTADO DE ORGANIZACIONES
        public async Task<List<User>> GetOrganizations()
        {
            var organizationList = new List<User>();

            //Conexión SQL
            using (var con = new SqlConnection(conection))
            {
                // Abrir la conexión
                await con.OpenAsync();


                //Comando SQL para ejecutar el stored procedure
                using (SqlCommand command = new SqlCommand("gkan.Emilio_GetOrgs", con))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Ejecutar el comando
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        // Leer los datos devueltos por el stored procedure
                        while (await reader.ReadAsync())
                        {
                            var Org = new User
                            {
                                OrganizationId = reader.GetInt32(0),
                                OrganizationName = reader["OrganizationName"] != DBNull.Value ? reader["OrganizationName"].ToString() : string.Empty
                            };
                            // Agregar ORGANIZACION a la lista
                            organizationList.Add(Org);
                        }
                    }
                }
            }
            return organizationList;
        }

        //METODO 6 DE PROCEDIMIENTOS ALMACENADOS

        //METODO DE OBTENCION DE LISTADO DE USUARIOS HUERFANOS
        public async Task<List<User>> GetOrphanUsers()
        {
            var orphanList = new List<User>();

            //Conexión SQL
            using (var con = new SqlConnection(conection))
            {
                // Abrir la conexión
                await con.OpenAsync();


                //Comando SQL para ejecutar el stored procedure
                using (SqlCommand command = new SqlCommand("gkan.Emilio_GetUsersWithoutOrganization", con))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Ejecutar el comando
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        // Leer los datos devueltos por el stored procedure
                        while (await reader.ReadAsync())
                        {
                            var list = new User
                            {
                                UserId = reader.GetInt32(0),
                                FirstName = reader.IsDBNull(1) ? null : reader.GetString(1),
                                LastName = reader.IsDBNull(2) ? null : reader.GetString(2),
                                Email = reader.IsDBNull(3) ? null : reader.GetString(3),
                                CreatedDate = reader.IsDBNull(4) ? (DateTime?)null : reader.GetDateTime(4)
                            };
                            // Agregar el detalle a la lista
                            orphanList.Add(list);
                        }
                    }
                }
            }
            return orphanList;
        }
    }
}