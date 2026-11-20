using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SipAndTell.Application.Catalog.Models.Entities;

namespace SipAndTell.Infrastructure.Catalog.EntityConfigurations
{
    /// <summary>
    /// Настройка таблицы чаёв
    /// </summary>
    public class TeaConfiguration : IEntityTypeConfiguration<Tea>
    {
        #region Методы

        /// <inheritdoc />
        public void Configure(EntityTypeBuilder<Tea> builder)
        {
            builder.ToTable("teas");
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Name).HasMaxLength(200).IsRequired();
            builder.Property(t => t.NormalizedName).HasMaxLength(200).IsRequired();
            builder.HasIndex(t => t.NormalizedName);
            builder.HasIndex(t => new { t.Status, t.OwnerId });
        }

        #endregion Методы
    }
}
