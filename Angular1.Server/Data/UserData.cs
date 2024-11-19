using Angular1.Server.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;


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
        public async Task<User?> Get(string username/*, string password*/)
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
                                Password = reader["Password"] != DBNull.Value ? reader["Password"].ToString() : string.Empty,
                                FirstName = reader["FirstName"] != DBNull.Value ? reader["FirstName"].ToString() : string.Empty,
                                LastName = reader["LastName"] != DBNull.Value ? reader["lastName"].ToString() : string.Empty,
                                Email = reader["Email"] != DBNull.Value ? reader["Email"].ToString() : string.Empty,
                                Initials = reader["Initials"] != DBNull.Value ? reader["Initials"].ToString() : string.Empty,
                                PasswordSalt = reader["PasswordSalt"] != DBNull.Value ? reader["PasswordSalt"].ToString() : string.Empty,
                                IsOauth = reader["IsOauth"] != DBNull.Value ? (int?)reader["IsOauth"] : null
                            };
                        }
                    }
                }
            }
            return user;
        }
        //METODO 2 DE PROCEDIMIENTOS ALMACENADOS

        //METODO DE OBTENCION PARA EL STOREDPROCEDURE DE DETALLES
        public async Task<User?> GetDetails(int userid)
        {
            User? user = null;

            //Conexión SQL
            using (var con = new SqlConnection(conection))
            {
                // Abrir la conexión
                await con.OpenAsync();


                //Comando SQL para ejecutar el stored procedure
                using (SqlCommand command = new SqlCommand("gkan.Emilio_GetDetails", con))
                {
                    command.Parameters.AddWithValue("@UserId",userid);
                    command.CommandType = CommandType.StoredProcedure;
                    // Ejecutar el comando
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            user = new User
                            {
                                FirstName = reader["FirstName"] != DBNull.Value ? reader["FirstName"].ToString() : string.Empty,
                                LastName = reader["LastName"] != DBNull.Value ? reader["lastName"].ToString() : string.Empty,
                                Email = reader["Email"] != DBNull.Value ? reader["Email"].ToString() : string.Empty,
                                Initials = reader["Initials"] != DBNull.Value ? reader["Initials"].ToString() : string.Empty,
                            };
                        }
                    }
                }
            }
            return user;
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

        //Metodo 7 DE PROCEDIMIENTOS ALMACENADOS

        //METODO DE INSERCION DE USUARIOS HUERFANOS A ORGANIZACION

        public async Task<bool> AddOrphanUserToOrganization(int userId, int organizationId)
        {
            using (var con = new SqlConnection(conection))
            {
                //Abrir conexion a base de datos
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("gkan.Emilio_AddOrphanUserToOrganization", con))
                {
                    //Definicion de tipo SP
                    cmd.CommandType = CommandType.StoredProcedure;
                    //Definicion de parametros
                    cmd.Parameters.Add(new SqlParameter("@UserId", userId));
                    cmd.Parameters.Add(new SqlParameter("@OrganizationId", organizationId));

                    try 
                    {
                        //Ejecucion de procedimiento almacenado
                        int rowsAffected = await cmd.ExecuteNonQueryAsync();

                        return true;

                    }catch(Exception e) 
                    {
                        throw new Exception("Error al insertar un usuario a la organizacion" + e.Message);
                    }
                }
            }
        }


        //Metodo 8 DE PROCEDIMIENTOS ALMACENADOS

        //METODO DE AUTENTICACION CON MICROSOFT Y GOOGLE
        public async Task<bool> OAuthLogin(string FirstName, string LastName, string Email, string ProviderUserId, string Provider)
        {
            using (var con = new SqlConnection(conection))
            {
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("gkan.Emilio_OAuth", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@FirstName", FirstName);
                    cmd.Parameters.AddWithValue("@LastName", LastName);
                    cmd.Parameters.AddWithValue("@Email", Email);
                    cmd.Parameters.AddWithValue("@ProviderUserId", ProviderUserId);
                    cmd.Parameters.AddWithValue("@Provider", Provider);


                    return true;
                }
            }
        }

        //Metodo 9 DE PROCEDIMIENTOS ALMACENADOS

        //METODO DE ACTUALIZACION DE DATOS DE PERFIL DE USUARIO

        public async Task<bool> UpdateProfileUser(int userId, string FirstName, string LastName, string Email, string Username)
        {
            using (var con = new SqlConnection(conection))
            {
                //Abrir conexion a base de datos
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("gkan.Emilio_UpdateUser", con))
                {
                    //Definicion de tipo SP
                    cmd.CommandType = CommandType.StoredProcedure;
                    //Definicion de parametros
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    cmd.Parameters.AddWithValue("@FirstName", FirstName);
                    cmd.Parameters.AddWithValue("@LastName", LastName);
                    cmd.Parameters.AddWithValue("@Email", Email);
                    cmd.Parameters.AddWithValue("@Username", Username);

                    try
                    {
                        //Ejecucion de procedimiento almacenado
                        int rowsAffected = await cmd.ExecuteNonQueryAsync();

                        return true;

                    }
                    catch (Exception e)
                    {
                        throw new Exception("Error al actualizar usuario" + e.Message);
                    }
                }
            }
        }

        //Metodo 10 DE PROCEDIMIENTOS ALMACENADOS

        //METODO DE VERIFICACION DE DATOS DE PERFIL DE USUARIO

        public async Task<(bool IsUserNameTaken, bool IsEmailTaken)> ValidateUserProfile(int userId, string Username, string Email)
        {
            using (var con = new SqlConnection(conection))
            {
                // Abrir la conexión
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("gkan.Emilio_ValidateUserProfile", con))
                {
                    // Definición de tipo de comando como Stored Procedure
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Definición de parámetros de entrada
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    cmd.Parameters.AddWithValue("@UserName", Username);
                    cmd.Parameters.AddWithValue("@Email", Email);

                    // Definición de parámetros de salida
                    var isUserNameTakenParam = new SqlParameter("@IsUserNameTaken", SqlDbType.Bit)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(isUserNameTakenParam);

                    var isEmailTakenParam = new SqlParameter("@IsEmailTaken", SqlDbType.Bit)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(isEmailTakenParam);

                    // Ejecución del Stored Procedure
                    await cmd.ExecuteNonQueryAsync();

                    // Recuperar los valores de los parámetros de salida
                    bool isUserNameTaken = isUserNameTakenParam.Value != DBNull.Value && (bool)isUserNameTakenParam.Value;
                    bool isEmailTaken = isEmailTakenParam.Value != DBNull.Value && (bool)isEmailTakenParam.Value;

                    return (isUserNameTaken, isEmailTaken);
                }
            }
        }


    }
}