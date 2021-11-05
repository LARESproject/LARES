<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0"
                xmlns:kiln="http://www.kcl.ac.uk/artshums/depts/ddh/kiln/ns/1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="response" mode="text-index">
    <table class="tablesorter">
      <thead>
        <tr>
          <!-- Let us assume that all texts have a filename, ID, and
               title. -->
          <th>ID</th>
          <!--<th>ID</th>-->
          <th>Title</th>
          <!--<xsl:if test="result/doc/arr[@name='author']/str">
            <th>Author</th>
          </xsl:if>
          <xsl:if test="result/doc/arr[@name='editor']/str">
            <th>Editor</th>
          </xsl:if>
          <xsl:if test="result/doc/str[@name='publication_date']">
            <th>Publication Date</th>
          </xsl:if>-->
        </tr>
      </thead>
      <tbody>
        <xsl:apply-templates mode="text-index" select="result/doc" >
          <xsl:sort>
            <xsl:variable name="id">
              <xsl:choose>
                <xsl:when test="starts-with(str[@name='document_id'], 'doc')"><xsl:value-of select="substring-after(replace(str[@name='document_id'], ' ', ''), 'doc')"/></xsl:when>
                <xsl:when test="starts-with(str[@name='document_id'], 'text')"><xsl:value-of select="substring-after(replace(str[@name='document_id'], ' ', ''), 'text')"/></xsl:when>
                <xsl:when test="starts-with(str[@name='document_id'], 'lexicon')"><xsl:value-of select="substring-after(replace(str[@name='document_id'], ' ', ''), 'lexicon')"/></xsl:when>
              </xsl:choose>
            </xsl:variable>
            <xsl:choose>
            <xsl:when test="string-length($id) = 1"><xsl:value-of select="concat('000',$id)"/></xsl:when>
            <xsl:when test="string-length($id) = 2"><xsl:value-of select="concat('00',$id)"/></xsl:when>
            <xsl:when test="string-length($id) = 3"><xsl:value-of select="concat('0',$id)"/></xsl:when>
            <xsl:otherwise><xsl:value-of select="$id"/></xsl:otherwise>
          </xsl:choose></xsl:sort>
        </xsl:apply-templates>
      </tbody>
    </table>
  </xsl:template>

  <xsl:template match="result[not(doc)]" mode="text-index">
    <p>There are no files indexed from
    webapps/ROOT/content/xml/<xsl:value-of select="$document_type" />!
    Put some there, index them from the admin page, and this page will
    become much more interesting.</p>
  </xsl:template>

  <xsl:template match="result/doc" mode="text-index">
    <tr>
      <xsl:apply-templates mode="text-index" select="str[@name='file_path']" />
      <!--<xsl:apply-templates mode="text-index" select="str[@name='document_id']" />-->
      <xsl:apply-templates mode="text-index" select="arr[@name='document_title']" />
      <!--<xsl:apply-templates mode="text-index" select="arr[@name='author']" />
      <xsl:apply-templates mode="text-index" select="arr[@name='editor']" />
      <xsl:apply-templates mode="text-index" select="str[@name='publication_date']" />-->
    </tr>
  </xsl:template>

  <xsl:template match="str[@name='file_path']" mode="text-index">
    <xsl:variable name="filename" select="substring-after(., '/')" />
    <td>
      <a href="{kiln:url-for-match($match_id, ($language, $filename), 0)}">
        <xsl:choose>
          <xsl:when test="starts-with($filename, 'doc')"><xsl:value-of select="substring-after($filename, 'doc')" /></xsl:when>
          <xsl:when test="starts-with($filename, 'text')"><xsl:value-of select="substring-after($filename, 'text')" /></xsl:when>
          <xsl:when test="starts-with($filename, 'lexicon')"><xsl:value-of select="substring-after($filename, 'lexicon')" /></xsl:when>
        </xsl:choose>
      </a>
    </td>
  </xsl:template>

  <xsl:template match="str[@name='document_id']" mode="text-index">
    <td><xsl:value-of select="replace(., ' ', '')" /></td>
  </xsl:template>

  <xsl:template match="arr[@name='document_title']" mode="text-index">
    <td><xsl:value-of select="string-join(str, '; ')" /></td>
  </xsl:template>

  <xsl:template match="arr[@name='author']" mode="text-index">
    <td><xsl:value-of select="string-join(str, '; ')" /></td>
  </xsl:template>

  <xsl:template match="arr[@name='editor']" mode="text-index">
    <td><xsl:value-of select="string-join(str, '; ')" /></td>
  </xsl:template>

  <xsl:template match="str[@name='publication_date']">
    <td><xsl:value-of select="." /></td>
  </xsl:template>

</xsl:stylesheet>
