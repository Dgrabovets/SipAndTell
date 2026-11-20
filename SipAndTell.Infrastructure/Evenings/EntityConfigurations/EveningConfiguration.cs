using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SipAndTell.Application.Catalog.Models.Entities;
using SipAndTell.Application.Evenings.Models.Entities;

namespace SipAndTell.Infrastructure.Evenings.EntityConfigurations
{
    /// <summary>
    /// Настройка таблицы чаепитий
    /// </summary>
    public class EveningConfiguration : IEntityTypeConfiguration<Evening>
    {
        #region Методы

        /// <inheritdoc />
        public void Configure(EntityTypeBuilder<Evening> builder)
        {
            builder.ToTable("evenings", table => table.HasCheckConstraint("ck_evenings_score", "score IS NULL OR (score >= 1 AND score <= 10)"));
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Score).HasColumnName("score");
            builder.Property(e => e.Review).HasMaxLength(Evening.MaxReviewLength).IsRequired();
            builder.HasOne<Tea>().WithMany().HasForeignKey(e => e.TeaId).OnDelete(DeleteBehavior.Restrict);
            builder.HasIndex(e => new { e.OwnerId, e.DrankAt });
        }

        #endregion Методы
    }
}
