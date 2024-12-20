<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet exclude-result-prefixes="#all" version="2.0"
                xmlns:h="http://apache.org/cocoon/request/2.0"
                xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
                xmlns:kiln="http://www.kcl.ac.uk/artshums/depts/ddh/kiln/ns/1.0"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- XSLT for displaying Solr results. -->

  <xsl:param name="root" select="/" />

  <xsl:include href="results-pagination.xsl" />

  <!-- Split the list of Solr facet fields that need to be looked up
       in RDF for its labels into a sequence for easier querying. -->
  <xsl:variable name="rdf-facet-lookup-fields-sequence"
                select="tokenize($rdf-facet-lookup-fields, ',')" />

  <!-- Display an unselected facet. -->
  <xsl:template match="int" mode="search-results">
    <xsl:variable name="name" select="../@name" />
    <xsl:variable name="value" select="@name" />
    <!-- List a facet only if it is not selected. -->
    <xsl:if test="not($request/h:parameter[@name=$name]/h:value = $value)">
      <li>
        <a>
          <xsl:attribute name="href">
            <xsl:value-of select="$query-string-at-start" />
            <xsl:text>&amp;</xsl:text>
            <xsl:value-of select="$name" />
            <xsl:text>=</xsl:text>
            <xsl:value-of select="kiln:escape-for-query-string($value)" />
          </xsl:attribute>
          <xsl:call-template name="display-facet-value">
            <xsl:with-param name="facet-field" select="$name" />
            <xsl:with-param name="facet-value" select="$value" />
          </xsl:call-template>
        </a>
        <xsl:call-template name="display-facet-count" />
      </li>
    </xsl:if>
  </xsl:template>

  <!-- Display unselected facets. -->
  <xsl:template match="lst[@name='facet_fields']" mode="search-results">
    <xsl:if test="lst/int">
      <h3>Facets</h3>

      <div class="section-container accordion"
           data-section="accordion">
        <xsl:apply-templates mode="search-results" />
      </div>
    </xsl:if>
  </xsl:template>

  <xsl:template match="lst[@name='facet_fields']/lst"
                mode="search-results">
    <xsl:variable name="toggle_facet_items"><xsl:text>toggle_visibility('</xsl:text><xsl:value-of select="@name"/><xsl:text>');</xsl:text></xsl:variable>
    <section>
      <p class="title" data-section-title="">
        <a href="#">
          <xsl:attribute name="onclick"><xsl:value-of select="$toggle_facet_items"/></xsl:attribute>
          <xsl:apply-templates mode="search-results" select="@name" />
        </a>
      </p>
      <div class="content" data-section-content="">
        <xsl:attribute name="id"><xsl:value-of select="@name"/></xsl:attribute>
        <xsl:attribute name="style"><xsl:text>display:none;</xsl:text></xsl:attribute>
        <ul class="no-bullet">
          <xsl:apply-templates mode="search-results" />
        </ul>
      </div>
    </section>
  </xsl:template>

  <!-- Display a facet's name. To rename facets, provide translations in 'webapps/ROOT/assets/translations/messages_xx.xml', 
    using as value of @key 'facet-' followed by the facet name, e.g. <message key="facet-source_repository">Repository</message> -->
  <xsl:template match="lst[@name='facet_fields']/lst/@name"
                mode="search-results">
    <i18n:text key="facet-{.}">
      <xsl:for-each select="tokenize(., '_')">
        <xsl:value-of select="upper-case(substring(., 1, 1))" />
        <xsl:value-of select="substring(., 2)" />
        <xsl:if test="not(position() = last())">
          <xsl:text> </xsl:text>
        </xsl:if>
      </xsl:for-each>
    </i18n:text>
  </xsl:template>

  <!-- Display an individual search result. -->
  <xsl:template match="result/doc[contains(str[@name='document_id'], '_')]" mode="search-results"> 
    <!-- added [contains(str[@name='document_id'], '_')] to hide other TEI files  -->
    <xsl:variable name="document-type" select="str[@name='document_type']" />
    <xsl:variable name="short-filepath"
                  select="substring-after(str[@name='file_path'], '/')" />
    <xsl:variable name="result-url">
      <xsl:choose>
        <xsl:when test="$document-type = 'tei'">
          <xsl:value-of select="kiln:url-for-match('local-tei-display-html', ($language, $short-filepath), 0)" />
        </xsl:when>
        <xsl:when test="$document-type = 'epidoc'">
          <xsl:value-of select="kiln:url-for-match('local-epidoc-display-html', ($language, $short-filepath), 0)" />
        </xsl:when>
      </xsl:choose>
    </xsl:variable>
    <xsl:if test="str[@name='document_id']">
    <li>
      <a href="{$result-url}">
        <xsl:variable name="doctype" select="substring-before($short-filepath, '_')"/>
        <xsl:choose>
          <xsl:when test="$doctype='com'">Book chapter: Comedy</xsl:when>
          <xsl:when test="$doctype='trag'">Book chapter: Tragedy</xsl:when>
          <xsl:when test="$doctype='hom'">Book chapter: Homer</xsl:when>
          <xsl:when test="$doctype='cpch'">Book chapter: Corpus Platonicum and Hippocraticum</xsl:when>
          <xsl:when test="$doctype='lexicon'">Lexicon</xsl:when>
          <xsl:when test="$doctype='text'">Text</xsl:when>
        </xsl:choose>
        <xsl:text>. </xsl:text>
        <xsl:choose>
          <xsl:when test="arr[@name='document_title']/str[2]">
            <xsl:if test="$language='it'"><xsl:value-of select="arr[@name='document_title']/str[1]"/></xsl:if>
            <xsl:if test="$language='en'"><xsl:value-of select="arr[@name='document_title']/str[2]"/></xsl:if>
            <xsl:if test="$language='pl'"><xsl:value-of select="arr[@name='document_title']/str[3]"/></xsl:if>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="arr[@name='document_title']/str[1]"/>
          </xsl:otherwise>
        </xsl:choose>
      </a>
    </li>
    </xsl:if>
  </xsl:template>

  <!-- Display search results. -->
  <xsl:template match="response/result" mode="search-results">
    <xsl:choose>
      <xsl:when test="number(@numFound) = 0">
        <h3>No results found</h3>
      </xsl:when>
      <xsl:when test="doc">
        <ul>
          <xsl:apply-templates mode="search-results" select="doc">
            <xsl:sort order="ascending">
              <xsl:variable name="doctype" select="substring-before(str[@name='document_id'], '_')"/>
              <xsl:variable name="sortdoctype">
              <xsl:choose>
                <xsl:when test="$doctype='com'">1</xsl:when>
                <xsl:when test="$doctype='trag'">2</xsl:when>
                <xsl:when test="$doctype='cpch'">3</xsl:when>
                <xsl:when test="$doctype='hom'">4</xsl:when>
                <xsl:when test="$doctype='lexicon'">5</xsl:when>
                <xsl:when test="$doctype='text'">6</xsl:when>
                <xsl:otherwise>5</xsl:otherwise>
              </xsl:choose>
              </xsl:variable>
              <xsl:variable name="sortfilename" select="translate(normalize-unicode(lower-case(arr[@name='document_title']/str[1]),'NFD'), '&#x0300;&#x0301;&#x0308;&#x0303;&#x0304;&#x0313;&#x0314;&#x0345;&#x0342;' ,'')"/>
              <xsl:choose>
                <xsl:when test="$sortdoctype">
                  <xsl:value-of select="concat($sortdoctype, $sortfilename)"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="concat(str[@name='document_id'], $sortfilename)"/>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:sort></xsl:apply-templates>
        </ul>

        <xsl:call-template name="add-results-pagination" />
      </xsl:when>
    </xsl:choose>
  </xsl:template>

  <!-- Display selected facets. -->
  <xsl:template match="*[@name='fq']" mode="search-results">
    <h3>Current filters</h3>

    <ul>
      <xsl:choose>
        <xsl:when test="local-name(.) = 'str'">
          <xsl:apply-templates mode="display-selected-facet" select="." />
        </xsl:when>
        <xsl:otherwise>
          <xsl:for-each select="str">
            <xsl:apply-templates mode="display-selected-facet" select="." />
          </xsl:for-each>
        </xsl:otherwise>
      </xsl:choose>
    </ul>
  </xsl:template>

  <!-- Display selected facet. -->
  <xsl:template match="str" mode="display-selected-facet">
    <!-- ORed facets have names and values that are different from
         ANDed facets and must be handled differently. ORed facets
         have the exclusion tag at the beginning of the name, and may
         have multiple values within parentheses separated by " OR
         ". -->
    <xsl:choose>
      <xsl:when test="starts-with(., '{!tag')">
        <xsl:call-template name="display-selected-or-facet" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="display-selected-and-facet" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="text()" mode="search-results" />

  <xsl:template name="display-facet-count">
    <xsl:text> (</xsl:text>
    <xsl:value-of select="." />
    <xsl:text>)</xsl:text>
  </xsl:template>

  <xsl:template name="display-facet-value">
    <xsl:param name="facet-field" />
    <xsl:param name="facet-value" />
    <xsl:choose>
      <xsl:when test="$facet-field = $rdf-facet-lookup-fields-sequence">
        <xsl:variable name="rdf-uri" select="concat($base-uri, $facet-value)" />
        <!-- QAZ: Uses only the first rdf:Description matching
             the $rdf-uri, due to the Sesame version not
             including the fix for
             https://github.com/eclipse/rdf4j/issues/742 (if an
             inferencing repository is used). -->
        <xsl:variable name="rdf-name" select="$root/aggregation/facet_names/rdf:RDF/rdf:Description[@rdf:about=$rdf-uri][1]/*[@xml:lang=$language][1]" />
        <xsl:choose>
          <xsl:when test="normalize-space($rdf-name)">
            <xsl:value-of select="$rdf-name" />
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="$facet-value" />
          </xsl:otherwise>
        </xsl:choose>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$facet-value" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Display a selected facet. -->
  <xsl:template name="display-selected-facet">
    <xsl:param name="name" />
    <xsl:param name="value" />
    <xsl:variable name="name-value-pair">
      <!-- Match the fq parameter as it appears in the query
           string. -->
      <xsl:value-of select="$name" />
      <xsl:text>=</xsl:text>
      <xsl:value-of select="kiln:escape-for-query-string($value)" />
    </xsl:variable>
    <li>
      <xsl:call-template name="display-facet-value">
        <xsl:with-param name="facet-field" select="$name" />
        <xsl:with-param name="facet-value" select="$value" />
      </xsl:call-template>
      <xsl:text> (</xsl:text>
      <!-- Create a link to unapply the facet. -->
      <a>
        <xsl:attribute name="href">
          <xsl:value-of select="kiln:string-replace($query-string-at-start,
                                $name-value-pair, '')" />
        </xsl:attribute>
        <xsl:text>x</xsl:text>
      </a>
      <xsl:text>)</xsl:text>
    </li>
  </xsl:template>

  <!-- Display a selected AND facet. -->
  <xsl:template name="display-selected-and-facet">
    <xsl:variable name="name" select="substring-before(., ':')" />
    <xsl:variable name="value"
                  select="replace(., '^[^:]+:&quot;(.*)&quot;$', '$1')" />
    <xsl:call-template name="display-selected-facet">
      <xsl:with-param name="name" select="$name" />
      <xsl:with-param name="value" select="$value" />
    </xsl:call-template>
  </xsl:template>

  <!-- Display a selected OR facet. -->
  <xsl:template name="display-selected-or-facet">
    <xsl:variable name="name"
                  select="substring-before(substring-after(., '}'), ':')" />
    <xsl:variable name="value" select="substring-before(substring-after(., ':('), ')')" />
    <xsl:for-each select="tokenize($value, ' OR ')">
      <xsl:call-template name="display-selected-facet">
        <xsl:with-param name="name" select="$name" />
        <!-- The facet value has surrounding quotes. -->
        <xsl:with-param name="value" select="substring(., 2, string-length(.)-2)" />
      </xsl:call-template>
    </xsl:for-each>
  </xsl:template>

  <xsl:function name="kiln:string-replace" as="xs:string">
    <!-- Replaces the first occurrence of $replaced in $input with
         $replacement. -->
    <xsl:param name="input" as="xs:string" />
    <xsl:param name="replaced" as="xs:string" />
    <xsl:param name="replacement" as="xs:string" />
    <xsl:sequence select="concat(substring-before($input, $replaced),
                          $replacement, substring-after($input, $replaced))" />
  </xsl:function>

</xsl:stylesheet>
