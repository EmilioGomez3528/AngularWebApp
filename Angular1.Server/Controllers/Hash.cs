// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Hash.cs" company="Gkan">
//   2017
// </copyright>
// <summary>
//   Defines the Hash type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Angular1.Server.Controllers
{
    using System;
    using System.Security.Cryptography;
    using System.Text;

    /// <summary>The hash.</summary>
    public class Hash
    {
        #region Methods

        /// <summary>The compute salted hash.</summary>
        /// <param name="password">The password.</param>
        /// <param name="salt">The salt.</param>
        /// <returns>The <see cref="string"/>.</returns>
        public static string ComputeSaltedHash(string password, string salt)
        {
            // Create Byte array of password string
            var encoder = new UnicodeEncoding();
            var secretBytes = encoder.GetBytes(password);

            // Create a new salt
            var saltBytes = Convert.FromBase64String(salt);

            // append the two arrays
            var toHash = new byte[secretBytes.Length + saltBytes.Length];
            Array.Copy(secretBytes, 0, toHash, 0, secretBytes.Length);
            Array.Copy(saltBytes, 0, toHash, secretBytes.Length, saltBytes.Length);

            var sha512 = SHA512.Create();
            var computedHash = sha512.ComputeHash(toHash);

            return Convert.ToBase64String(computedHash);
        }

        /// <summary>The create random salt.</summary>
        /// <returns>The <see cref="string"/>.</returns>
        public static string CreateRandomSalt()
        {
            var saltBytes = new byte[4];
            var rng = new RNGCryptoServiceProvider();
            rng.GetBytes(saltBytes);

            return Convert.ToBase64String(saltBytes);
        }

        /// <summary>The consumer secret.</summary>
        private const string ConsumerSecret = "GKAN.WEB.OAuth";

        /// <summary>The compute hash.</summary>
        /// <param name="components">The components.</param>
        /// <returns>The <see cref="string"/>.</returns>
        public static string ComputeHash(params object[] components)
        {
            var hmacsha1 = new HMACSHA1 { Key = Encoding.ASCII.GetBytes(string.Format("{0}&{1}", components)) };
            return ComputeHash(hmacsha1, ConsumerSecret);
        }

        /// <summary>The compute hash.</summary>
        /// <param name="hashAlgorithm">The hash algorithm.</param>
        /// <param name="data">The data.</param>
        /// <returns>The <see cref="string"/>.</returns>
        /// <exception cref="ArgumentNullException"></exception>
        public static string ComputeHash(HashAlgorithm hashAlgorithm, string data)
        {
            if (hashAlgorithm == null) { throw new ArgumentNullException("hashAlgorithm"); }
            if (string.IsNullOrEmpty(data)) { throw new ArgumentNullException("data"); }

            var dataBuffer = Encoding.ASCII.GetBytes(data);
            var hashBytes = hashAlgorithm.ComputeHash(dataBuffer);

            return Convert.ToBase64String(hashBytes);
        }

        #endregion Methods
    }
}
